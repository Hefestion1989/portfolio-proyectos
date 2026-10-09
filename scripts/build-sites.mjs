import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { relative, resolve, dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist");
const layout = await readFile(resolve(root, "_layouts/default.html"), "utf8");

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

function renderPage(metadata, markdown) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description || "Proyectos, herramientas y ensayos desde Montevideo, Uruguay.");
  return layout
    .replace(/^.*<link rel="canonical".*\r?\n/m, "")
    .replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, (_, path) => path)
    .replace(/\{\{\s*site\.lang\s*\|\s*default:\s*'es-UY'\s*\}\}/g, "es-UY")
    .replace(/\{\{\s*page\.description\s*\|\s*default:\s*site\.description\s*\|\s*escape\s*\}\}/g, description)
    .replace(/\{\{\s*page\.title\s*\}\}/g, title)
    .replace(/\{\{\s*content\s*\}\}/g, marked.parse(markdown));
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
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, renderPage(metadata, markdown));
    }
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, ".openai"), { recursive: true });
await cp(resolve(root, "index.html"), resolve(output, "index.html"));
await cp(resolve(root, "assets"), resolve(output, "assets"), { recursive: true });
await cp(resolve(root, ".openai/hosting.json"), resolve(output, ".openai/hosting.json"));
for (const section of ["archivo", "notas", "proyectos"]) {
  await buildDirectory(resolve(root, section));
}
