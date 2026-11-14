<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Guía de agentes — portafolio vitrina

Leer primero: `README.md`, `docs/indice.md`, `docs/contenido.md` y `node_modules/next/dist/docs/` antes de tocar código Next.

Estado: sitio en construcción. Las obras son `test_N`, las fichas muestran el tipo de dato y el shop tiene montos `—`. Producción: https://ismael.palmatellez.cl

## Entorno Windows

- PowerShell 5.1 con `npm.cmd` (nunca `npm` ni `npm.ps1`).
- Archivos nuevos en UTF-8 SIN BOM con saltos LF (el BOM rompe eslint).
- Tests: `node --test tests/*.test.ts`. Verificación total: verify + typecheck + lint + build.
- El primer `next build` o `next dev` puede detenerse con el aviso de seguridad de Next 16.4; reintentar el mismo comando lo continúa.

## Reglas del sitio (las cuida `scripts/verify.mjs`)

- Bilingüe simétrico: todo texto visible en `{es,en}`; solo slug, año y nombres propios son neutros.
- Prohibida la compra online: sin carrito, checkout, pagos ni formularios. `shop` es la excepción para mostrar piezas y precios. Sin secciones media/textos.
- Tipos `pintura|dibujo|3d`. Periodos con en-dash: 2026, 2024–25, 2022–23, 2020–21, 2018–19.
- La ruta 3D es `/tresde`, nunca `/3d`; la tienda es `/shop`. La home enlaza a la única obra con `destacada:true` a través del propio 3D (`HomeHero3D`), sin CTA.
- Las obras usan nombres de prueba `test_N` y slugs `test-N`; no reintroducir nombres inventados. La destacada es `test_1` (`/obra/test-1`).
- En construcción: los campos de ficha muestran el tipo de dato (`Técnica`/`Technique`, `Materiales`/`Materials`, `Medidas`/`Dimensions`, `Descripción`/`Description`); no usar datos inventados. El año y el periodo se mantienen.
- Evitar la palabra `media` en textos EN (el verificador la bloquea); usar `disciplines` u otra similar.
- Máximo un canvas three por página; nada de canvas en listas; 3D solo en cliente con `dynamic` y `ssr:false`. Excepción transitoria: el retrato 3D al hover del nombre, que se desmonta al salir.
- El visor usa `touch-action: pan-y`: en móvil el swipe vertical hace scroll y el horizontal gira la figura.
- Export estático para GitHub Pages: `output:export` + `trailingSlash` + `images.unoptimized` en `next.config.mjs`; `generateStaticParams` en locales y slugs; sin middleware (no corre en export); sin base path (dominio propio en la raíz). La raíz redirige a `/es/` con script, porque `redirect()` no corre en export.
- Home sin scroll y pie pegado al viewport: `home-viewport` mide `100dvh`, la sección `home-oscura` flexiona y el pie queda al fondo. En la home solo se ve el título (sin subtítulo ni CTA).
- En móvil el menú es fijo y las páginas internas llevan `padding-top` (4.5rem) para no quedar debajo.

## Menú, tema y 3D

- Menú fijo translúcido en todos los tamaños. Escritorio: enlaces en línea y juntos (`gap` 0.8rem) con el nombre aislado a la izquierda. Móvil (<768px): nombre + sol/luna + ES/EN + hamburguesa; el panel de enlaces se despliega debajo (`MenuMovil`) y cierra al navegar o con Escape.
- Tema claro por defecto y oscuro con `data-tema` en `<html>`; la elección se guarda en `vitrina-tema-v2` (cambiar la clave fuerza el claro de nuevo). El botón muestra luna en claro y sol en oscuro. El script inline del layout aplica el tema antes de pintar.
- Los visores 3D leen el tema, usan canvas transparente y ajustan luces (verde/violeta más profundos en claro). El retrato `head_1.glb` del hover del nombre arranca en la oreja izquierda, gira lento, con luz frontal y sin figura procedural mientras carga (`reservaProcedural={false}`).
- Home: los tres modelos (torus, `mech_char_2`, `mech_char_pose1`) arrancan a distancia 4 para no tapar el título. Los visores de ficha usan la distancia por defecto (4.2).

## Secciones y contenido

- Índices, fichas, biografía, contacto y shop; el contenido vive en `src/content/*.ts`.
- Biografía: resumen real (artista visual que trabaja en Santiago de Chile; pintura, dibujo y escultura) y listas reales de individuales, colectivas y residencias; reconocimientos vacío se oculta.
- Contacto: `ismael@palmatellez.cl` e Instagram `@isma.elismael`, sin formulario.
- Shop: `/shop` (`src/app/[locale]/shop/page.tsx`), piezas en `src/content/productos.ts` (nombres `test_1`..`test_6` y monto `—`), panel blanco con grilla de 2 columnas; sin carrito ni compra. Imágenes placeholder por ahora.

## Ramas y commits

- Producción: `main` en `portafolio_ismael` (GitHub Pages: https://ismael.palmatellez.cl). No commitear `node_modules`, `.next`, `.superpowers`, `.obsidian`.
- Commits en español, formato `area: descripción breve`.
- No editar la misma rama a la vez que el dueño u otra sesión sin avisar: pisa cambios.

## Diseño

- Tokens y clases en `src/app/globals.css`; Space Grotesk en títulos, Inter en cuerpo (next/font, self-hosted).
- Fondo y textos cambian con el tema; los acentos verde/violeta se adaptan al claro.
- Los ajustes visuales se iteran de a uno: cambio chico, build verde, commit.

## Pendientes

- Actualizar Next 16.4.0: el build avisa de una vulnerabilidad conocida (reintentar el build continúa).
- Shop: faltan fotos y precios reales (hoy monto `—`).
- Fichas 3D: los modelos `/models/test-N.*` no existen; el visor usa geometría procedural. La home usa `mech_char_2.glb` y `mech_char_pose1.glb`.
- Fotos reales: reemplazar `PlaceholderArt` cuando estén.
- Contenido en construcción: títulos `test_N` y campos por tipo; no reintroducir datos inventados.
