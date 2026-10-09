---
title: Blog y cuaderno
description: Reflexiones, textos técnicos, lecturas y proyectos de Damián Sebastián Gómez.
---

# Blog y cuaderno

Un lugar para compartir reflexiones, textos técnicos, lecturas y el recorrido de los proyectos. El cuaderno reúne las entradas publicadas en este sitio y una selección de trabajos que se pueden leer en otras plataformas.

<!-- entradas-del-cuaderno -->
{% if site.posts.size > 0 %}
## Entradas del cuaderno

{% for post in site.posts %}
### [{{ post.title }}]({{ post.url | relative_url }})

{{ post.date | date: "%d/%m/%Y" }} · {{ post.category }}

{{ post.description }}

{% endfor %}
{% endif %}
<!-- fin-entradas-del-cuaderno -->

<!-- publicaciones-medium -->
{% if site.data.medium.profile_url %}
<section id="medium" aria-labelledby="medium-title">
<h2 id="medium-title">Mis escritos en Medium</h2>
<p><a href="{{ site.data.medium.profile_url | escape }}">Ver todas las publicaciones en Medium</a></p>
{% for article in site.data.medium.articles %}
<article>
<h3><a href="{{ article.url | escape }}">{{ article.title | escape }}</a></h3>
{% if article.date %}<p class="post-meta">{{ article.date | date: "%d/%m/%Y" }} · Medium</p>{% endif %}
<p>{{ article.description | escape }}</p>
<p><a href="{{ article.url | escape }}">Leer en Medium</a></p>
</article>
{% endfor %}
</section>
{% endif %}
<!-- fin-publicaciones-medium -->

## Lecturas para empezar

### Una voz en el bucle

Ensayo sobre usuarios no técnicos, pluralismo de valores y participación en la inteligencia artificial conversacional.

[Leer en Academia.edu](https://www.academia.edu/143449753/Una_voz_en_el_bucle_ChatGPT_5_pluralismo_de_valores_y_la_democratizaci%C3%B3n_de_la_IA_conversacional)

### El cuerpo en red

Artículo de divulgación sobre inflamación, metabolismo, dolor, sueño y psiquiatría desde una lectura integrada de la salud.

[Leer en Academia.edu](https://www.academia.edu/168585066/El_cuerpo_en_red)

### ¿Es tan difícil el hard problem de la consciencia?

Una mirada desde la emergencia, el organismo y los sistemas complejos a la experiencia subjetiva.

[Leer en Academia.edu](https://www.academia.edu/168835633/Es_tan_dif%C3%ADcil_el_hard_problem_de_la_consciencia_Una_mirada_desde_la_emergencia_el_organismo_y_los_sistemas_complejos)

## Tecnología y proyectos

Las fichas de los proyectos reúnen explicaciones de uso, límites y enlaces a su documentación técnica.

- [Apunte Claro: preparar materiales para estudiar con una IA](../proyectos/apunte-claro.html).
- [Cronista: organizar fuentes, evidencias y capítulos](../proyectos/cronista.html).
- [Mapa Comunitario: encontrar recursos con sus fuentes](../proyectos/mapa-comunitario.html).
- [Todos los proyectos](../proyectos/).

## Otros recorridos

- [Índice completo de ensayos y publicaciones](../notas/).
- [Perfil en Academia.edu](https://udelar.academia.edu/DamianGomez).
- [Escritos en Medium](https://medium.com/@DamianSebastianGomez).
- [Proyectos y código en GitHub](https://github.com/Hefestion1989).
