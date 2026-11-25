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
- Las obras usan nombres de prueba `test_N` y slugs `test-N`; no reintroducir nombres inventados. La destacada es `Flower_scene` (`/obra/flower-scene`), una obra 3D.
- En construcción: los campos de ficha muestran el tipo de dato (`Técnica`/`Technique`, `Materiales`/`Materials`, `Medidas`/`Dimensions`, `Descripción`/`Description`); no usar datos inventados. El año y el periodo se mantienen.
- Evitar la palabra `media` en textos EN (el verificador la bloquea); usar `disciplines` u otra similar.
- Máximo un canvas three por página; nada de canvas en listas; 3D solo en cliente con `dynamic` y `ssr:false`. Excepción transitoria: el retrato 3D al hover del nombre, que se desmonta al salir.
- El visor usa `touch-action: pan-y`: en móvil el swipe vertical hace scroll y el horizontal gira la figura.
- CI (`.github/workflows/pages.yml`): corre verify, lint, tests y build antes de publicar; si una revisión falla, no se publica.
- Export estático para GitHub Pages: `output:export` + `trailingSlash` + `images.unoptimized` en `next.config.mjs`; `generateStaticParams` en locales y slugs; sin middleware (no corre en export); sin base path (dominio propio en la raíz). La raíz redirige a `/es/` con script, porque `redirect()` no corre en export.
- Home sin scroll y pie pegado al viewport: `home-viewport` mide `100dvh`, la sección `home-oscura` flexiona y el pie queda al fondo. En la home solo se ve el título (sin subtítulo ni CTA).
- En móvil el menú es fijo y las páginas internas llevan `padding-top` (4.5rem) para no quedar debajo.

## Menú, tema y 3D

- Menú fijo translúcido en todos los tamaños. Escritorio: enlaces en línea y juntos (`gap` 0.8rem) con el nombre aislado a la izquierda. Móvil (<768px): nombre + sol/luna + ES/EN + hamburguesa; el panel de enlaces se despliega debajo (`MenuMovil`) y cierra al navegar o con Escape.
- Tema claro por defecto y oscuro con `data-tema` en `<html>`; la elección se guarda en `vitrina-tema-v2` (cambiar la clave fuerza el claro de nuevo). El botón muestra luna en claro y sol en oscuro. El script inline del layout aplica el tema antes de pintar.
- Rueda del mouse: en la home el 3D hace zoom con la rueda; en las fichas solo con Ctrl, para que la página baje con la rueda. Si el WebGL falla, el visor no tumba la app (se queda vacío).
- Los visores 3D leen el tema, usan canvas transparente y ajustan luces (verde/violeta más profundos en claro). El retrato `head_1.glb` del hover del nombre arranca en la oreja izquierda, aparece solo con hover en el nombre, sin fondo ni marco, y gira en su eje (giro automático `velocidad={0.032}`) hasta que el puntero sale del nombre; sin seguimiento del mouse (pendiente de retomar), con luz frontal y sin figura procedural mientras carga (`reservaProcedural={false}`).
- Home: rota al azar en cada carga entre los modelos de `MODELOS` (`HomeHero3D.tsx`): `Flower_scene.glb` (flores, distancia 3.5, destacada), `Buildings_Brutalist_1.glb` (compañero, distancia 4), `Boxer_gold.glb` (compañero, distancia 4) y `Boxer_helmet.glb` (compañero, distancia 4). El título del home cambia según el modelo que sale (el `h1` vive en `HomeHero3D`, elegido al azar sin afectar el HTML del servidor). REGLA: toda figura 3D que suba el dueño va al home, intercalada al azar con las demás (agregada a `MODELOS`, sin quitar a las existentes), y también a `OBRAS_3D` (título = nombre que pida el dueño, sin destacada) con su miniatura `public/thumbs/<slug>.png`, renderizada del modelo con fondo transparente. Con eso el home debe mostrar cada figura en la rotación. Los visores de ficha de pintura usan la distancia por defecto (4.2); las fichas 3D usan 3.8 para verse más grandes.

- Modo recorrer (`Viewer3D` con `recorrer`, activo solo en `Gallery+_map_1` vía `obras.ts`): cámara a la altura de los ojos, sin giro automático ni zoom con la rueda por defecto. Controles: W/A/S/D o flechas (clic en el visor para enfocarlo), arrastrar con el botón izquierdo para mirar, arrastrar con el botón central para avanzar/retroceder/lado (en el modo libre). Choques con paredes con un rayo corto. Clic sobre una obra (objetos `dibujo*`, `paisaje*`, `Plane*`) la enmarca de frente, con distancia según su tamaño; otro clic devuelve la vista anterior. Con la obra enmarcada: la rueda acerca o aleja (sin atravesar muros), el botón central gira alrededor de la obra con un arco de 140° (±70°). En modo libre la rueda cambia el ángulo de la cámara entre 20° y 45°.
- Punto de inicio del recorrido: coordenadas fijas en `Viewer3D` (`localToWorld` desde `-3.6, 0, -1.0` mirando al centro del cartel `Text.003`, con el `pitch` calculado a la altura del cartel); si cambia la escena hay que ajustar esos dos puntos. `mirar` en `obras.ts` ya solo elige una obra con foco. Los nombres de nodo del GLB llegan saneados por three (`Plane.004` → `Plane004`, `dibujo mañio` → `dibujo_mañio`), así que hay que buscarlos con el helper `buscar`, no con `getObjectByName`. Luces: blanco sin verde/violeta; ambiente 1 en recorrer; cuatro `SpotLight` tenues bajo el riel del techo de la sala principal (x del glb −4,0, −3,3, −2,6 y −1,9; y 3,15; ángulo π/4; intensidad 1,2; apuntando al suelo) y focos de 0,5 en `mirar`, `Text.003`, `dibujo mañio`, `paisaje_hztl_mañio` (subir la intensidad quema las paredes y el rótulo). Las lámparas del archivo son utilería y no emiten luz. El plano de recorte de la cámara es 0,01.
- Si cambia el archivo 3D: optimizar antes (meshopt no lo soporta el visor; usar `@gltf-transform/cli optimize ... --texture-size 1024 --compress false`), y revisar los nombres de nodos de `mirar` y de obras, que son específicos de esta escena.
- El proyecto se integrará en el portafolio de Pili. Estos visores y el modo recorrer son reutilizables; los nombres de nodos y la distancia de inicio no lo son.

## Secciones y contenido

- Índices, fichas, biografía, contacto y shop; el contenido vive en `src/content/*.ts`.
- Biografía: resumen real (artista visual que trabaja en Santiago de Chile; pintura, dibujo y escultura) y listas reales de individuales, colectivas y residencias; reconocimientos vacío se oculta.
- Contacto: `ismael@palmatellez.cl` e Instagram `@isma.elismael`, sin formulario.
- Shop: `/shop` (`src/app/[locale]/shop/page.tsx`), piezas en `src/content/productos.ts` (nombres `test_1`..`test_6` y monto `—`), panel blanco con grilla de 2 columnas; sin carrito ni compra. Imágenes placeholder por ahora. No aparece en el menú: se entra por URL hasta tener precios y fotos reales.
- Miniaturas 3D: `public/thumbs/test-N.png` (render real del modelo, fondo transparente). La tarjeta de `/tresde` las usa; si falta el archivo, se ve el placeholder. Para regenerarlas hay que renderizar el modelo con three.js (no está en el repo).
- Metadatos: título y descripción por idioma en `meta` (`src/i18n/messages/*.json`), usados por `generateMetadata` del layout de idioma; las fichas usan el título de la obra con la plantilla `%s · Ismael Palma Téllez`.

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
- Probar el scroll del visor en un celular real: no se encontró causa en el código; el usuario describió la molestia pero no el caso exacto.
- Cambios de la sesión sin commitear (revisar `git status` antes de commitear).
- Shop: faltan fotos y precios reales (hoy monto `—`).
- Sección 3D: 7 obras. `Gallery+_map_1` (`/obra/gallery-map-1`) es un mapa explorable (modo recorrer, ver abajo), con 1,65 MB optimizado desde 23 MB. `Boxer_gold` usa `Boxer_gold.glb` y `Boxer_helmet` usa `Boxer_helmet.glb` (ambos compañeros en la home). `Flower_scene` usa `Flower_scene.glb` (destacada de la home, nombre del archivo como título); `Buildings_Brutalist_1` usa `Buildings_Brutalist_1.glb` (compañero en la home); `test_34` usa `mech_char_2.glb` y `test_35` usa `mech_char_pose1.glb`. `test_33` se quitó del sitio. Cada una tiene su ficha (`/obra/test-N`); el clic en la home lleva a la ficha del modelo que se ve. Si un archivo falta, la ficha muestra "Modelo 3D en preparación".
- Fotos reales: reemplazar `PlaceholderArt` cuando estén.
- Contenido en construcción: títulos `test_N` y campos por tipo; no reintroducir datos inventados.

## Mapa del vault

La documentación completa está en el [[docs/indice|mapa de documentación]].
