import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { relative, resolve, dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist");
const siteUrl = new URL(process.env.SITES_URL || "https://damian-proyectos.hefestion.chatgpt.site/");
const layout = await readFile(resolve(root, "_layouts/default.html"), "utf8");
const medium = JSON.parse(await readFile(resolve(root, "_data/medium.json"), "utf8"));
function publicationUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Los enlaces de publicaciones deben usar HTTPS y no incluir credenciales");
  }
  return escapeHtml(url.href);
}
function renderMedium() {
  if (!medium.profile_url) return "";
  const profile = publicationUrl(medium.profile_url);
  const articles = medium.articles.map(({ title, description, url }) => {
    const link = publicationUrl(url);
    return `<article><h3><a href="${link}">${escapeHtml(title)}</a></h3><p>${escapeHtml(description || "")}</p><p><a href="${link}">Leer en Medium</a></p></article>`;
  });
  return `<section id="medium" aria-labelledby="medium-title"><h2 id="medium-title">Mis escritos en Medium</h2><p><a href="${profile}">Ver todas las publicaciones en Medium</a></p>${articles.join("\n")}</section>`;
}
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Montevideo" }).format(new Date());
const posts = [];
const postPaths = new Set();
for (const entry of await readdir(resolve(root, "_posts"))) {
  if (entry === "README.md") continue;
  const match = entry.match(/^(\d{4}-\d{2}-\d{2})-.+\.md$/);
  if (!match) throw new Error(`Nombre de entrada inválido: ${entry}`);
  const date = match[1];
  if (!Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
    throw new Error(`Fecha de entrada inválida: ${entry}`);
  }
  if (date > today) continue;
  const page = parsePage(await readFile(resolve(root, "_posts", entry), "utf8"));
  const path = page.metadata.permalink;
  if (!/^\/blog\/[a-z0-9][a-z0-9-]*\.html$/.test(path || "") || path === "/blog/index.html" || postPaths.has(path)) {
    throw new Error(`Enlace de entrada inválido o repetido: ${entry}`);
  }
  postPaths.add(path);
  posts.push({ ...page, date, path });
}
posts.sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path));

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function parsePage(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error("La página no tiene front matter de Jekyll");
  const metadata = Object.fromEntries(match[1].split(/\r?\n/).filter(Boolean).map((line) => {
    const separator = line.indexOf(":");
    if (separator < 0) throw new Error(`Dato de página inválido: ${line}`);
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "")];
  }));
  if (!metadata.title) throw new Error("La página no tiene título");
  return { metadata, markdown: source.slice(match[0].length) };
}

function renderPage(metadata, markdown, path) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description || "Proyectos, herramientas y ensayos desde Montevideo, Uruguay.");
  return layout
    .replace(/^.*<link rel="canonical".*$/m, `  <link rel="canonical" href="${escapeHtml(new URL(path, siteUrl).href)}">`)
    .replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, (_, path) => path)
    .replace(/\{\{\s*site\.lang\s*\|\s*default:\s*'es-UY'\s*\}\}/g, "es-UY")
    .replace(/\{\{\s*page\.description\s*\|\s*default:\s*site\.description\s*\|\s*escape\s*\}\}/g, () => description)
    .replace(/\{\{\s*page\.title\s*\}\}/g, () => title)
    .replace(/\{\{\s*content\s*\}\}/g, () => marked.parse(markdown));
}

function renderPostIndex() {
  if (!posts.length) return "";
  const items = posts.map(({ metadata, date, path }) => {
    const category = metadata.category ? ` · ${escapeHtml(metadata.category)}` : "";
    const description = metadata.description ? `<p>${escapeHtml(metadata.description)}</p>` : "";
    return `<article><h3><a href="${path}">${escapeHtml(metadata.title)}</a></h3><p class="post-meta"><time datetime="${date}">${date.split("-").reverse().join("/")}</time>${category}</p>${description}</article>`;
  });
  return `<section aria-labelledby="entradas-title"><h2 id="entradas-title">Entradas del cuaderno</h2>${items.join("\n")}</section>`;
}

async function buildDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) {
      await buildDirectory(source);
    } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
      const path = relative(root, source).split(sep).join("/");
      const target = resolve(output, path.replace(/\.md$/, ".html"));
      const { metadata, markdown } = parsePage(await readFile(source, "utf8"));
      const content = path === "blog/index.md"
        ? markdown.replace(/<!-- entradas-del-cuaderno -->[\s\S]*?<!-- fin-entradas-del-cuaderno -->/, () => renderPostIndex())
          .replace(/<!-- publicaciones-medium -->[\s\S]*?<!-- fin-publicaciones-medium -->/, () => renderMedium())
        : markdown;
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, renderPage(metadata, content, path.replace(/\.md$/, ".html").replace(/index\.html$/, "")));
    }
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, ".openai"), { recursive: true });
const homepage = await readFile(resolve(root, "index.html"), "utf8");
await writeFile(resolve(output, "index.html"), homepage.replaceAll(
  "https://hefestion1989.github.io/portfolio-proyectos/", siteUrl.href,
));
await cp(resolve(root, "assets"), resolve(output, "assets"), { recursive: true });
await cp(resolve(root, ".openai/hosting.json"), resolve(output, ".openai/hosting.json"));
for (const section of ["archivo", "notas", "proyectos", "blog"]) {
  await buildDirectory(resolve(root, section));
}
for (const { metadata, markdown, path, date } of posts) {
  const category = metadata.category ? ` · ${escapeHtml(metadata.category)}` : "";
  const dateLabel = date.split("-").reverse().join("/");
  const byline = `<p class="post-meta"><time datetime="${date}">${dateLabel}</time>${category}</p>\n\n`;
  await writeFile(resolve(output, path.slice(1)), renderPage(metadata, byline + markdown, path.slice(1)));
}
