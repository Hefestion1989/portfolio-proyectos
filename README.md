# Hub de herramientas, escritura y ensayos

Archivo público de proyectos, notas, ensayos y trabajos académicos de Damián Sebastián Gómez. Es una puerta de entrada a herramientas, escritura e investigación sobre inteligencia artificial, psicología, salud mental, cultura, subjetividad y tecnología.

## Sobre mí

Soy estudiante de Psicología en la UdelaR, con formación en Recursos Humanos e interés en inteligencia artificial, subjetividad, salud mental, cultura científica y tecnología. Esta página reúne proyectos abiertos y trabajo intelectual en desarrollo.

## Entradas principales

- [Blog y cuaderno](https://damian-proyectos.hefestion.chatgpt.site/blog/): reflexiones, textos técnicos y una selección de publicaciones en otras plataformas.
- [Herramientas](https://damian-proyectos.hefestion.chatgpt.site/#herramientas): estudio, recursos comunitarios, prompts, verificación y diagnóstico local.
- [Escritura](https://damian-proyectos.hefestion.chatgpt.site/#escritura): Cronista, Tinta Viva y Tinta Privada.
- [Ensayos y escritos](https://damian-proyectos.hefestion.chatgpt.site/#ensayos): publicaciones organizadas por tema.

La dirección pública del hub es [damian-proyectos.hefestion.chatgpt.site](https://damian-proyectos.hefestion.chatgpt.site/). Los cambios de esta rama deben publicarse en ese proyecto para aparecer allí.

- [Notas y trabajos](notas/README.md): índice curado de ensayos, artículos y textos publicados.
- [Proyectos](proyectos/README.md): herramientas, prototipos y repositorios técnicos.

## Proyectos destacados

- [Apunte Claro](proyectos/apunte-claro.md): herramienta abierta para preparar
  resúmenes académicos con materiales propios y la IA que cada estudiante elija.
- [Mapa Comunitario](proyectos/mapa-comunitario.md): buscador abierto de recursos de salud mental, apoyo social, educación, trabajo y emergencias en Uruguay.
- [Tinta Viva](proyectos/tinta-viva.md): aplicación local-first para escritura, personajes y continuidad narrativa con modelos locales.
- [Auditoría Local PC](proyectos/auditoria-local-pc.md): diagnóstico local de CPU, memoria, disco, batería y procesos para Windows, sin recopilar actividad personal ni enviar datos por red.
- [Ensayos sobre IA y consciencia](notas/ia-y-consciencia/README.md): textos sobre subjetividad artificial, vínculos humano-IA y filosofía de la mente.

Tinta Privada continúa disponible como proyecto independiente de escritura y roleplay local dentro del [índice completo de proyectos](proyectos/README.md).

## Repos vinculados

- [`portfolio-proyectos`](https://github.com/Hefestion1989/portfolio-proyectos): esta vitrina pública.
- [`apunte-claro`](https://github.com/Hefestion1989/apunte-claro): método abierto
  para preparar materiales y pedidos académicos antes de usar una IA.
- [`mapa-comunitario`](https://github.com/Hefestion1989/mapa-comunitario): directorio verificable de recursos comunitarios de Uruguay.
- [`tinta-viva`](https://github.com/Hefestion1989/tinta-viva): compañía narrativa local-first para Windows.
- [`auditoria-local-pc`](https://github.com/Hefestion1989/auditoria-local-pc): diagnóstico de rendimiento privado para Windows, con informes locales y código abierto.
- [`VeryCheck`](https://github.com/Hefestion1989/VeryCheck): verificación y fact-checking experimental.
- [`promptmaster-ai`](https://github.com/Hefestion1989/promptmaster-ai): herramienta para trabajar prompts.
- [`Prompts`](https://github.com/Hefestion1989/Prompts): taller simple y offline de prompts.
- [`subjetividad-no-biologica`](https://github.com/Hefestion1989/subjetividad-no-biologica): archivo editorial sobre subjetividad artificial.

## Criterio

- La vitrina muestra y orienta.
- El código y los materiales de trabajo viven en sus repositorios.
- GitHub centraliza un recorrido público que se pueda entender sin conocer el mundo técnico.

## Build para ChatGPT Sites

`npm ci && npm run build:sites` genera `dist/`: conserva la portada HTML y las imágenes, y convierte las páginas Markdown de `archivo/`, `notas/`, `proyectos/`, `blog/` y las entradas de `_posts/` a HTML. GitHub Pages continúa usando su configuración Jekyll. Los enlaces de herramientas apuntan a sus direcciones públicas conocidas: Sites para Apunte Claro y Cronista, GitHub Pages para las demás aplicaciones web, y fichas o repositorios para las aplicaciones locales. Los otros Sites que ya existen podrán enlazarse al confirmar sus direcciones públicas.

El build usa `https://damian-proyectos.hefestion.chatgpt.site/` para las URLs canónicas y la imagen de vista previa. Podés cambiar ese origen con la variable `SITES_URL`; los metadatos de GitHub Pages en el archivo fuente se conservan. No cambia automáticamente el Site publicado: hace falta conectar estos archivos con el proyecto correspondiente y publicar la actualización desde Sites.

## Agregar un texto propio

Guardá el texto en `_posts/AAAA-MM-DD-titulo.md` siguiendo la [guía del cuaderno](_posts/README.md). El índice del blog se actualiza al generar el sitio. Puede ser una reflexión breve, una guía técnica o un relato sobre un proyecto; no necesita convertirse en un trabajo académico. Las publicaciones externas se enlazan desde `blog/index.md` o `notas/`, conservando sus direcciones originales. El build no sincroniza ni modifica GitHub o Academia.edu.

## Escritos de Medium

`_data/medium.json` permite conectar el perfil de Medium y mostrar una selección de artículos en el blog, con título, presentación breve y enlace a la publicación original. La sección aparece al completar `profile_url`; mientras falta el enlace, se omite del sitio público.

Cada elemento de `articles` tiene los campos `title`, `description` y `url`. La lista también funciona en GitHub Pages mediante Jekyll. No copia el texto completo ni sincroniza nuevas entradas automáticamente: el enlace al perfil permite recorrer todas las publicaciones, y la selección se actualiza en este archivo. El perfil conectado es [@DamianSebastianGomez](https://medium.com/@DamianSebastianGomez).

El feed público correspondiente es `https://medium.com/feed/@DamianSebastianGomez`. El catálogo incluye las 10 publicaciones disponibles en el RSS al importar el 9 de octubre de 2026, con sus títulos, fechas y enlaces originales. Este feed no incluye descripciones, por lo que esos campos quedan vacíos. El build usa el catálogo guardado, sin consultar Medium.

`python3 scripts/import-medium.py` consulta ese feed y actualiza el catálogo con títulos, fechas, descripciones breves y enlaces originales. También acepta un archivo RSS descargado: `python3 scripts/import-medium.py ruta/al/feed.xml`. Después ejecutá `npm run build:sites`. Necesita Python 3, sin paquetes adicionales, y conserva las entradas anteriores y sus descripciones seleccionadas al actualizar. El feed de Medium ofrece una selección reciente; no garantiza incluir todo el archivo histórico. La importación se ejecuta a pedido y no modifica las publicaciones en Medium.

Si la consulta desde Python devuelve HTTP 403, podés descargar el RSS con `curl` y usar la opción de archivo:

```sh
curl --fail --show-error --silent --max-time 30 'https://medium.com/feed/@DamianSebastianGomez' -o /tmp/portfolio-medium.xml
python3 scripts/import-medium.py /tmp/portfolio-medium.xml
npm run build:sites
```
