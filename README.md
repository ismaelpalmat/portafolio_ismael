# Portafolio · Ismael Palma Téllez

Vitrina artística bilingüe (español + inglés): pinturas, dibujos y escultura digital en un sitio oscuro, mínimo y futurista. Sin tienda, sin precios, sin formularios. Solo la obra.

La home es un 3D gigante que gira bajo dos focos de color, con un easter egg para quien interactúa. Los índices son grillas de 4 columnas agrupadas por periodos. Cada ficha tiene carrusel con teclado o viewer 3D con órbita y zoom (OBJ/STL). Cierran biografía y contacto directo con galería y estudio.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · next-intl · three.js · Node 24. Todo estático y desplegado en Vercel desde GitHub (rama `main`).

## Rutas (ES de ejemplo; EN idéntico)

- `/es` — home mínima sin scroll: subtítulo, 3D gigante, título
- `/es/pinturas`, `/es/dibujos`, `/es/tresde` — índices por periodo, grilla de 4
- `/es/obra/[slug]` — ficha con carrusel o viewer 3D + anterior/siguiente del mismo tipo
- `/es/biografia` — bio + individuales, colectivas, reconocimientos
- `/es/contacto` — galería y estudio, sin formulario

## Comandos (en Windows: `npm.cmd`)

- `npm.cmd run dev` — desarrollo
- `npm.cmd run verify` — invariantes del sitio (conteos, periodos, simetría ES/EN, sin comercio)
- `npm.cmd run typecheck` / `lint` / `build`
- `node --test tests/*.test.ts` — tests de contenido e i18n

## Contenido (ficticio por ahora)

32 pictóricas + 8 3D en `src/content/*.ts`, diccionarios en `src/i18n/messages/`. Las fotos reales reemplazan a `PlaceholderArt`; los modelos reales (.obj/.stl) van a `public/models/`. Guía completa en [docs/contenido.md](docs/contenido.md).

## Documentación (legible en Obsidian)

- [docs/indice.md](docs/indice.md) — mapa
- [docs/contenido.md](docs/contenido.md) — cómo sumar obra, fotos y modelos
- [docs/diseno.md](docs/diseno.md) — tokens, clases y pendientes visuales
- [docs/despliegue.md](docs/despliegue.md) — GitHub + Vercel + rollback
