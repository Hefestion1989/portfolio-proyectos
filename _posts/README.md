# Entradas del cuaderno

Cada texto propio se guarda en un archivo Markdown con nombre `AAAA-MM-DD-titulo.md`. Esa fecha es la fecha de publicación elegida por el autor. No hay entradas de ejemplo publicadas ni reflexiones redactadas en su nombre.

El archivo debe tener este encabezado, seguido del texto:

```markdown
---
layout: default
title: "Título del texto"
description: "Una frase breve para presentar la entrada."
category: "Reflexiones"
permalink: /blog/titulo.html
---

# Título del texto

El texto que quieras compartir.
```

Usá una categoría como `Reflexiones`, `Tecnología`, `Psicología` o `Proyectos`. El `permalink` debe empezar con `/blog/`, terminar en `.html` y ser único. GitHub Pages y el build de Sites usan ese mismo enlace.

`npm run build:sites` convierte las entradas a HTML y las agrega al índice de `blog/`, ordenadas por fecha. Las fechas futuras no se publican hasta llegar su día en Uruguay. Los ensayos ya publicados en Academia.edu pueden seguir allí: alcanza con enlazarlos desde el cuaderno o desde `notas/`.
