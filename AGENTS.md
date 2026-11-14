<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Guía de agentes — portafolio vitrina

Leer primero: `README.md`, `docs/indice.md` y `node_modules/next/dist/docs/` antes de tocar código Next.

## Entorno Windows

- PowerShell 5.1 con `npm.cmd` (nunca `npm` ni `npm.ps1`).
- Archivos nuevos en UTF-8 SIN BOM con saltos LF (el BOM rompe eslint).
- Tests: `node --test tests/*.test.ts`. Verificación total: verify + typecheck + lint + build.

## Reglas del sitio (las cuida `scripts/verify.mjs`)

- Bilingüe simétrico: todo texto visible en `{es,en}`; solo slug, año y dimensiones son neutros.
- Prohibida la compra online: sin carrito, checkout, pagos ni formularios. `shop` es la excepción para mostrar piezas y precios. Sin secciones media/textos.
- Tipos `pintura|dibujo|3d`. Periodos con en-dash: 2026, 2024–25, 2022–23, 2020–21, 2018–19.
- La ruta 3D es `/tresde`, nunca `/3d`. La home enlaza a la única obra con `destacada:true`.
- Máximo un canvas three por página; nada de canvas en listas; 3D solo en cliente con `dynamic` y `ssr:false`.
- Export estático para GitHub Pages: `output:export` + `trailingSlash` + `images.unoptimized` en `next.config.mjs`; `generateStaticParams` en locales y slugs; sin middleware (no corre en export); sin base path (dominio propio en la raíz). La raíz redirige a `/es/` con script, porque `redirect()` no corre en export.

## Ramas y commits

- Producción: `main` en `portafolio_ismael`. No commitear `node_modules`, `.next`, `.superpowers`, `.obsidian`.
- Commits en español, formato `area: descripción breve`.
- No editar la misma rama a la vez que el dueño u otra sesión sin avisar: pisa cambios.

## Diseño

- Tokens y clases en `src/app/globals.css`. Tema claro por defecto (`#fff`) y oscuro (`#0a0a0f`) vía `data-tema` en `<html>`; la elección se guarda en `vitrina-tema` y el visor 3D ajusta sus luces. Space Grotesk en títulos, Inter en cuerpo (next/font, self-hosted).
- Menú superior fijo translúcido (claro u oscuro según el tema); pie con ©, año dinámico y derechos bilingües.
- Los ajustes visuales se iteran de a uno: cambio chico, build verde, commit.
