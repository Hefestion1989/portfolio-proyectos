#!/usr/bin/env python3
"""Import Medium RSS metadata, preserving previously collected articles."""

import argparse
import json
import re
import sys
from datetime import timezone
from email.utils import parsedate_to_datetime
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
from urllib.request import urlopen
from xml.etree import ElementTree
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "_data" / "medium.json"


class PlainText(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.feed(source)

    def handle_data(self, data):
        self.parts.append(data)

    def text(self):
        return " ".join(" ".join(self.parts).split())


def article_url(value):
    url = urlsplit(value.strip())
    if url.scheme != "https" or not url.hostname or url.username or url.password:
        raise ValueError("El enlace de un artículo no es una dirección HTTPS válida")
    return urlunsplit((url.scheme, url.netloc, url.path, "", ""))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("feed_file", nargs="?", type=Path, help="Archivo RSS XML; si se omite, consulta Medium")
    args = parser.parse_args()
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    profile = urlsplit(catalog.get("profile_url") or "")
    if profile.hostname != "medium.com" or not re.fullmatch(r"/@[A-Za-z0-9_.-]+/?", profile.path):
        raise ValueError("Primero configurá un perfil https://medium.com/@usuario")
    feed_url = "https://medium.com/feed" + profile.path.rstrip("/")
    if args.feed_file:
        xml = args.feed_file.read_bytes()
    else:
        with urlopen(feed_url, timeout=20) as response:
            xml = response.read()
    channel = ElementTree.fromstring(xml).find("channel")
    if channel is None:
        raise ValueError("El archivo no contiene un canal RSS de Medium")

    articles = {article_url(item["url"]): item for item in catalog.get("articles", [])}
    imported = 0
    for item in channel.findall("item"):
        title = " ".join(unescape(item.findtext("title", "")).split())
        url = article_url(item.findtext("link", ""))
        if not title:
            raise ValueError("Hay una entrada RSS sin título")
        previous = articles.get(url, {})
        article = {**previous, "title": title, "url": url}
        # Use only RSS descriptions, never the full content:encoded article.
        if not article.get("description"):
            summary = PlainText(item.findtext("description", "")).text()
            article["description"] = summary if len(summary) <= 260 else summary[:257].rsplit(" ", 1)[0] + "…"
        published = item.findtext("pubDate")
        if published:
            date = parsedate_to_datetime(published)
            if date.tzinfo is None:
                date = date.replace(tzinfo=timezone.utc)
            article["date"] = date.astimezone(ZoneInfo("America/Montevideo")).date().isoformat()
        articles[url] = article
        imported += 1
    catalog["articles"] = sorted(articles.values(), key=lambda item: item.get("date", ""), reverse=True)
    # Write only after the entire feed has been parsed successfully.
    temporary = CATALOG.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(CATALOG)
    print(f"{imported} entradas leídas; {len(articles)} artículos conservados en el catálogo.")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, ElementTree.ParseError) as error:
        print(f"No se pudo importar Medium: {error}", file=sys.stderr)
        sys.exit(1)
