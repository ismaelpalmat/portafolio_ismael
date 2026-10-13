---
title: "Portfolio Vitrina 3D Implementation Plan"
date: 2026-10-13
tags: [plan, portafolio, vitrina-3d]
status: por-revisar
---

# Portfolio Vitrina 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar el portafolio estático (index.html, Trabajos.html, Biografia.html, Media.html,
Textos.html, contact.html + Bootstrap) a una vitrina Next.js bilingüe (ES default + EN) con home
oscura mínima con 3D gigante auto-rotatorio, índices de pinturas/dibujos/3D agrupados por periodo,
fichas pictóricas con carrusel y fichas 3D con viewer cuadrado, biografía y contacto sin formulario,
todo con contenido ficticio v1, publicable en Vercel con render estático.
**Architecture:** Next.js 16 App Router con segmento dinámico `/[locale]`, contenido tipado en
`src/content/*.ts` (20 pictóricas + 4 3d), diccionarios next-intl en
`src/i18n/messages/{es,en}.json`, componentes server por defecto + islas client solo para 3D
(`three`, dynamic `ssr:false`, máximo 1 canvas vivo por página) y carrusel, estático vía
`generateStaticParams` para locales y slugs (sin `output:export`), verificación con
`scripts/verify.mjs` + `tsc --noEmit` + `eslint` + `next build`.
**Tech Stack:** Node 24.19.0, Next.js 16.4.0, React 19.3.0, TypeScript ~5.6, Tailwind CSS 4.3.3,
next-intl 4.14.9, three 0.186.1 (+ `three/examples/jsm/loaders/OBJLoader.js` / `STLLoader.js` o
`three-stdlib` según exista para la versión instalada), ESLint, Vercel + GitHub.
**Spec:** (diseño aprobado en conversación; resume que el diseño vive en este prompt) Fuente de
verdad = spec del prompt de este plan: migración total con borrado del HTML viejo; v1 todo ficticio
sin fotos reales; fuera Media y Textos (ni sitio ni verify); ES primero/default + EN segundo con
diccionarios simétricos (solo slug/año/dimensiones numéricas neutros;
técnica/materiales/descripciones/biografía/contacto-labels en `{es,en}`); rutas `/[locale]`,
`/[locale]/pinturas`, `/[locale]/dibujos`, `/[locale]/tresde` (etiqueta menú "3D"),
`/[locale]/obra/[slug]`, `/[locale]/biografia`, `/[locale]/contacto`; home mínima sin scroll en
desktop (móvil scroll fallback) con subtítulo + 3D gigante centrado auto-rotatorio que enlaza a obra
`destacada:true` + título, fondo oscuro solo home con 2 spotlights laterales; índices agrupados por
periodos `2026, 2024–25, 2022–23, 2020–21, 2018–19` con tarjeta (imagen + título + año); índice 3D
igual pero tarjeta con IMAGEN FIJA (prohibido canvas vivo en listas); ficha pictórica con carrusel
(flechas grandes ‹ ›, contador `2/5`, clic a overlay oscuro, teclado ← → / Escape), datos
año/técnica/materiales/dimensiones, texto `{es,en}`, anterior/siguiente dentro del mismo tipo; ficha
3D con viewer cuadrado (auto-rota, drag orbita, rueda zoom, fondo oscuro + 2 focos) + mismos
datos/nav; bio con listas (individuales, colectivas, reconocimientos); contacto con datos
galería/estudio SIN formulario; contenido en `src/content/*.ts` (20 pictóricas + 4 3d con `modelo`
en `public/models/` + `formato: obj|stl`); imágenes = `PlaceholderArt` CSS (gradiente + etiqueta);
modelos = geometría procedural (torus knot / icosaedro) hasta OBJ/STL reales; fondo claro excepto
home oscura, una columna, menú superior pequeño con interruptor ES/EN, aire menú-imagen, Space
Grotesk títulos + Inter cuerpo, menús transparencia/blur superpuestos, hovers con movimiento, ajuste
iterativo posterior; verify obligatorio con invariantes + typecheck + lint + build verdes y scripts
npm `verify/typecheck/lint/build`; Next 16 + React 19 + Tailwind 4 son requisitos con verificación
de registry en Task 1.

## Global Constraints

- Windows: usar `npm.cmd` en todos los comandos (nunca `npm`/`npm.ps1` — bloqueado por

  ExecutionPolicy). Node v24.19.0. Verificación con comandos exactos listados en cada task.

- Máximo UN canvas vivo (`three`) por página. Prohibido canvas vivo en listas/índices (tarjeta 3D =

  imagen fija `PlaceholderArt`). Solo client components para 3D con `dynamic(..., { ssr: false })`.

- Sin `output:export`. Despliegue Vercel desde GitHub = build estándar `next build` +

  `generateStaticParams` para `[locale]` y `[slug]`.

- Borrado del HTML viejo y archivos inservibles (decisión del dueño). NO migrar fotos reales en v1.

  NO reintroducir secciones Media/Textos en sitio, contenido, diccionarios, nav ni verify.

- Todo texto visible en `{es,en}` simétrico; solo `slug`/año/dimensiones numéricas pueden ser

  neutros. Prohibidas palabras comerciales: `precio, comprar, tienda, carrito, checkout, pago` (+
  equivalentes EN `price, buy, shop, cart, checkout, payment`) en contenido, diccionarios y UI.

- Fuentes: Space Grotesk solo títulos, Inter cuerpo. Fondo oscuro SOLO home y viewer/ficha 3D; resto

  fondo claro. Una columna. Menú superior pequeño con interruptor ES/EN.

- Cada task termina con su verificación en verde + commit. No avanzar con rojo.

## Review Focus

- Simetría i18n ES/EN: toda clave visible existe en ambos locales y todo `LocalizedText` tiene

  `es`+`en` no vacíos (Tasks 2, 3, 8; tests en `tests/content.test.ts`, `tests/i18n.test.ts`,
  `scripts/verify.mjs`).

- Integridad de contenido: 20 pictóricas + 4 3d, slugs únicos, periodos solo los 5 válidos,

  `destacada:true` en exactamente 1 obra, tipos `pintura|dibujo|3d` correctos (Tasks 2, 10;
  `tests/content.test.ts` + verify).

- Rutas y navegación: `/[locale]`, `/pinturas`, `/dibujos`, `/tresde` (nunca `/3d`), `/obra/[slug]`,

  `/biografia`, `/contacto`; anterior/siguiente filtra por mismo `tipo`; home enlaza a destacada;
  interruptor ES/EN conserva ruta (Tasks 3–8; tests de rutas en verify + typecheck).

- Rendimiento 3D: máximo 1 canvas por página, listas sin canvas, `ssr:false`, loaders solo en

  cliente, procedural hasta modelos reales (Tasks 4, 5, 7; revisión manual + `grep` en verify).

- Diseño y accesibilidad: carrusel con flechas ‹ ›, contador, overlay, teclado ← → / Escape; viewer

  cuadrado orbit/zoom; spotlights home; blur/transparencia menús; hovers con movimiento (Tasks 4, 6,
  7, 9; revisión manual + build verde).
---

## File Structure

- `package.json` — MODIFY: scripts `verify`, `typecheck`, `lint`, `build`, `dev`; deps

  `next@16.4.0`, `react@19.3.0`, `tailwindcss@4.3.3`, `next-intl@4.14.9`, `three@0.186.1` (+
  `@types/three` dev si existe).

- `tsconfig.json` — CREATE/MODIFY: strict, `noEmit`, paths `@/*` → `src/*`, plugin Next.
- `next.config.mjs` — CREATE: plugin `next-intl`, sin `output:export`.
- `postcss.config.mjs` / `tailwind` v4 CSS-first — CREATE/MODIFY: `@import "tailwindcss";` en

  `src/app/globals.css`.

- `src/app/globals.css` — CREATE: tokens, fuentes (Space Grotesk + Inter), fondo claro default,

  utilidades overlay/blur/spotlight.

- `src/app/layout.tsx` — CREATE: layout raíz, `metadata`, fuentes, `globals.css`.
- `src/app/[locale]/layout.tsx` — CREATE: `generateStaticParams` locales, `NextIntlClientProvider`,

  menú + footer.

- `src/app/[locale]/page.tsx` — CREATE: home mínima sin scroll (server) + viewer gigante client.
- `src/app/[locale]/pinturas/page.tsx` — CREATE: índice pinturas agrupado.
- `src/app/[locale]/dibujos/page.tsx` — CREATE: índice dibujos agrupado.
- `src/app/[locale]/tresde/page.tsx` — CREATE: índice 3D agrupado (imágenes fijas).
- `src/app/[locale]/obra/[slug]/page.tsx` — CREATE: `generateStaticParams` slugs, bifurca ficha

  pictórica vs 3D.

- `src/app/[locale]/biografia/page.tsx` — CREATE: bio + listas.
- `src/app/[locale]/contacto/page.tsx` — CREATE: datos galería/estudio sin formulario.
- `src/i18n/request.ts` — CREATE: `getRequestConfig` next-intl (lee `locale`, importa

  `messages/{es,en}.json`).

- `src/i18n/routing.ts` — CREATE: `locales = ['es','en']`, `defaultLocale = 'es'`, `localePrefix =

  'always'`.

- `src/i18n/messages/es.json` — CREATE: diccionario ES (nav, home, índices, ficha, bio, contacto).
- `src/i18n/messages/en.json` — CREATE: diccionario EN simétrico (mismas claves).
- `src/content/tipos.ts` — CREATE: `Locale`, `LocalizedText`, `Periodo`, `TipoObra`,

  `ObraPictorica`, `Obra3D`, `Obra`, `PERIODOS`, `esLocalizado()`.

- `src/content/obras.ts` — CREATE: `OBRAS_PICTORICAS: ObraPictorica[]` (20) + `OBRAS_3D: Obra3D[]`

  (4) + helpers `todasLasObras()`, `obraPorSlug()`, `obrasPorTipo()`, `vecinasDelMismoTipo()`,
  `obraDestacada()`.

- `src/content/biografia.ts` — CREATE: `BIOGRAFIA: { nombre, resumen: LocalizedText, individuales:

  LocalizedText[], colectivas: LocalizedText[], reconocimientos: LocalizedText[] }`.

- `src/content/contacto.ts` — CREATE: `CONTACTO: { galeria: { nombre, direccion: LocalizedText,

  email, telefono }, estudio: { nombre, direccion: LocalizedText, email } }` (sin formulario).

- `src/components/LocaleSwitcher.tsx` — CREATE: client, interruptor ES/EN que conserva pathname.
- `src/components/SiteNav.tsx` — CREATE: menú superior pequeño (Inicio, Pinturas, Dibujos,

  3D→/tresde, Biografía, Contacto) + `LocaleSwitcher`, blur/transparente.

- `src/components/PlaceholderArt.tsx` — CREATE: server, `div` gradiente + etiqueta slug/título

  (reemplazable por `<Image>` real).

- `src/components/GrupoPorPeriodo.tsx` — CREATE: server, agrupa obras por `PERIODOS` y renderiza

  secciones.

- `src/components/TarjetaObra.tsx` — CREATE: server, `Link` a `/obra/[slug]` con `PlaceholderArt` +

  título + año (imagen fija también para 3d).

- `src/components/Carrusel.tsx` — CREATE: client, props `imagenes: {etiqueta: string}[]`, flechas ‹

  ›, contador `i/n`, overlay, teclado.

- `src/components/FichaDatos.tsx` — CREATE: server, año/técnica/materiales/dimensiones + descripción

  `{es,en}`.

- `src/components/AnteriorSiguiente.tsx` — CREATE: server, nav dentro del mismo tipo.
- `src/components/Viewer3D.tsx` — CREATE: client `three`, `props { modelo: string; formato:

  'obj'|'stl'; titulo: string }`, canvas cuadrado, auto-rotación + orbit + zoom, 2 focos, geometría
  procedural fallback.

- `src/components/HomeHero3D.tsx` — CREATE: client, wrapper del 3D gigante de home (1 canvas,

  auto-rotación, clic → obra destacada).

- `src/components/Spotlights.tsx` — CREATE: server, dos focos laterales CSS.
- `middleware.ts` — CREATE: middleware next-intl (`createMiddleware` con `routing`).
- `scripts/verify.mjs` — CREATE: invariantes (conteos, periodos, simetría, palabras prohibidas,

  media/textos, rutas, canvas, destacada).

- `tests/content.test.ts` — CREATE: tests Node (conteos, slugs únicos, periodos, `{es,en}`,

  destacada única, modelo/formato 3d).

- `tests/i18n.test.ts` — CREATE: tests Node (simetría claves es/en, sin claves media/textos).
- `public/models/.gitkeep` — CREATE: placeholder hasta OBJ/STL reales.
- Archivos a BORRAR: `index.html`, `Trabajos.html`, `Biografia.html`, `Media.html`, `Textos.html`,

  `contact.html` (+ CSS/JS huérfanos de Bootstrap si existen).

## Tasks

### Task 1 — Scaffold Next.js 16 + limpieza + toolchain + verify esqueleto

**Files:**

- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`,

  `src/app/globals.css`, `src/app/layout.tsx`, `scripts/verify.mjs`, `public/models/.gitkeep`

- Modify: ninguno (repo parte de HTML estático)
- Delete: `index.html`, `Trabajos.html`, `Biografia.html`, `Media.html`, `Textos.html`,

  `contact.html`

- Test: `scripts/verify.mjs` (modo esqueleto: falla si quedan `*.html` viejos o `Media`/`Textos`

  referenciados)
**Interfaces:**

- Consumes: `npm.cmd view next@16 version`, `npm.cmd view react@19 version`, `npm.cmd view

  tailwindcss@4 version` (verificación de registry; Node `process.version` = `v24.19.0`)

- Produces: `scripts/verify.mjs -> export async function verify(): Promise<{ ok: boolean; errores:

  string[] }>` (esqueleto: chequea ausencia de HTML viejo + ausencia de `media`/`textos` en
  `src/**`; retorna `ok:false` con lista si incumple)
**Steps:**

- [ ] Step 1.1 — Verificar versiones en registry: correr `npm.cmd view next@16 version; npm.cmd view

      react@19 version; npm.cmd view tailwindcss@4 version; npm.cmd view next-intl version; npm.cmd
      view three version; node --version` y anotar resultado (esperado: `next@16.4.0`,
      `react@19.3.0`, `tailwindcss@4.3.3`, `next-intl@4.14.9`, `three@0.186.1`, `node v24.19.0`; si
      alguna no existe, anotarlo en este plan y usar la mayor estable disponible dejando constancia
      en el commit sin romper el resto del plan).

- [ ] Step 1.2 — Escribir `package.json` con scripts exactos `verify: node scripts/verify.mjs`,

      `typecheck: tsc --noEmit`, `lint: next lint` (fallback `eslint .` si Next 16 ya no trae `next
      lint`), `build: next build`, `dev: next dev` y deps fijadas `next@16.4.0 react@19.3.0
      tailwindcss@4.3.3 next-intl@4.14.9 three@0.186.1`.

- [ ] Step 1.3 — Escribir `scripts/verify.mjs` esqueleto que falla si existe algún `*.html` raíz o

      si `grep` encuentra `media|textos` (case-insensitive) en `src/**`, e imprime `VERIFY OK/FAIL`
      con lista de errores.

- [ ] Step 1.4 — Correr `node scripts/verify.mjs` y confirmar que FALLA (hay HTML viejo) antes de

      borrar.

- [ ] Step 1.5 — Instalar: correr `npm.cmd install` y confirmar `node_modules/next/package.json` =

      `16.4.0` y `node_modules/react/package.json` = `19.3.0`.

- [ ] Step 1.6 — Crear `tsconfig.json` (strict, `noEmit`, paths `@/*`), `next.config.mjs` (sin

      `output:export`), `postcss.config.mjs`, `src/app/globals.css` (`@import "tailwindcss";`),
      `src/app/layout.tsx` mínimo, `public/models/.gitkeep`.

- [ ] Step 1.7 — Borrar `index.html`, `Trabajos.html`, `Biografia.html`, `Media.html`,

      `Textos.html`, `contact.html` (más restos Bootstrap huérfanos si `Get-ChildItem` los muestra).

- [ ] Step 1.8 — Verificación: correr `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint;

      npm.cmd run build` y confirmar todo verde (si `next lint` ya no existe, usar `npm.cmd run
      lint` con `eslint .` y dejar constancia).

- [ ] Step 1.9 — Commit: `git add -A; git commit -m "task1: scaffold next16 + limpieza html +

      toolchain + verify esqueleto"`.

### Task 2 — Tipos + contenido ficticio (20 pictóricas + 4 3d) + tests de contenido

**Files:**

- Create: `src/content/tipos.ts`, `src/content/obras.ts`, `tests/content.test.ts`
- Modify: `scripts/verify.mjs` (añadir invariantes de

  conteo/periodos/simetría/comerciales/destacada/modelos)

- Test: `tests/content.test.ts` (runner Node sin framework: `node --test tests/content.test.ts` o

  script `node tests/content.test.ts`)
**Interfaces:**

- Consumes: nada previo (solo `tipos.ts` dentro del task)
- Produces: `src/content/tipos.ts -> export type Periodo =

  '2026'|'2024–25'|'2022–23'|'2020–21'|'2018–19'; export const PERIODOS: Periodo[]; export type
  TipoObra = 'pintura'|'dibujo'|'3d'; export interface LocalizedText { es: string; en: string };
  export function esLocalizado(v: unknown): v is LocalizedText` + `src/content/obras.ts -> export
  const OBRAS_PICTORICAS: ObraPictorica[]; export const OBRAS_3D: Obra3D[]; export function
  todasLasObras(): Obra[]; export function obraPorSlug(slug: string): Obra | undefined; export
  function obrasPorTipo(tipo: TipoObra): Obra[]; export function vecinasDelMismoTipo(slug: string):
  { anterior: Obra | null; siguiente: Obra | null }; export function obraDestacada(): Obra;`
**Steps:**

- [ ] Step 2.1 — Escribir `tests/content.test.ts` que falla: exige `OBRAS_PICTORICAS.length===20`,

      `OBRAS_3D.length===4`, slugs únicos, `periodo ∈ PERIODOS`, todo
      `titulo/tecnica/materiales/descripcion` con `es+en` no vacíos, exactamente 1 `destacada:true`,
      cada 3d con `modelo` bajo `public/models/` y `formato ∈ {obj,stl}`.

- [ ] Step 2.2 — Correr `node --test tests/content.test.ts` y confirmar que FALLA (no existe

      `src/content/obras.ts`).

- [ ] Step 2.3 — Implementar firma exacta en `src/content/tipos.ts` (`Periodo`, `PERIODOS`,

      `TipoObra`, `LocalizedText`, `ObraPictorica`, `Obra3D`, `Obra`, `esLocalizado`).

- [ ] Step 2.4 — Implementar firma exacta en `src/content/obras.ts`: 20 pictóricas ficticias

      repartidas en los 5 periodos (p.ej. 4 por periodo, mezcla `pintura|dibujo`, `año` coherente
      con periodo, `dimensiones` string neutro, `imagenes: 3`) + 4 3d ficticias (una por periodo
      reciente, `modelo: '/models/pieza-N.obj'|.stl'`, `formato` acorde), exactamente 1 con
      `destacada:true`.

- [ ] Step 2.5 — Correr `node --test tests/content.test.ts` y confirmar verde.
- [ ] Step 2.6 — Ampliar `scripts/verify.mjs` con invariantes: conteos 20+4, periodos válidos,

      simetría `{es,en}`, ausencia de
      `precio|comprar|tienda|carrito|checkout|pago|price|buy|shop|cart|payment`, ausencia de
      `media|textos`, `destacada` única.

- [ ] Step 2.7 — Verificación: correr `npm.cmd run verify; npm.cmd run typecheck` en verde.
- [ ] Step 2.8 — Commit: `git add -A; git commit -m "task2: tipos + contenido ficticio 20+4 + tests

      contenido"`.

### Task 3 — i18n (ES default + EN) + layout + menú ES/EN

**Files:**

- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/messages/es.json`,

  `src/i18n/messages/en.json`, `src/components/LocaleSwitcher.tsx`, `src/components/SiteNav.tsx`,
  `src/app/[locale]/layout.tsx`, `middleware.ts`, `tests/i18n.test.ts`

- Modify: `src/app/layout.tsx` (delegar locale), `scripts/verify.mjs` (chequear claves simétricas +

  ruta `/tresde` + ausencia media/textos en nav)

- Test: `tests/i18n.test.ts`

**Interfaces:**

- Consumes: `src/content/tipos.ts -> Locale ('es'|'en')`
- Produces: `src/i18n/routing.ts -> export const locales = ['es','en'] as const; export const

  defaultLocale = 'es'; export type Locale = 'es'|'en'` + `src/components/LocaleSwitcher.tsx ->
  export default function LocaleSwitcher({ locale }: { locale: Locale }): JSX.Element` +
  `src/components/SiteNav.tsx -> export default function SiteNav({ locale }: { locale: Locale }):
  JSX.Element` (links: `/[locale]`, `/pinturas`, `/dibujos`, `/tresde` con etiqueta "3D",
  `/biografia`, `/contacto`)
**Steps:**

- [ ] Step 3.1 — Escribir `tests/i18n.test.ts` que falla: exige paridad exacta de claves

      `es.json`/`en.json` (mismas claves, ningún valor vacío), y que ningún valor contenga
      `media|textos|precio|comprar|tienda|carrito|checkout|pago` (ni EN).

- [ ] Step 3.2 — Correr `node --test tests/i18n.test.ts` y confirmar que FALLA.
- [ ] Step 3.3 — Implementar firma exacta en `src/i18n/routing.ts` (`locales`, `defaultLocale='es'`)

      y en `src/i18n/request.ts` (`getRequestConfig` que carga `messages/{es,en}.json`).

- [ ] Step 3.4 — Implementar `es.json`/`en.json` simétricos (claves

      `nav.{inicio,pinturas,dibujos,tresde,biografia,contacto}`, `home.*`, `indices.*`, `ficha.*`,
      `bio.*`, `contacto.*`; etiqueta 3D = `"3D"` en ambos).

- [ ] Step 3.5 — Implementar firma exacta en `src/components/LocaleSwitcher.tsx` (client, conserva

      pathname al cambiar `es↔en`) y en `src/components/SiteNav.tsx` (server, menú pequeño + blur,
      link "3D" apunta a `/[locale]/tresde` nunca a `/3d`).

- [ ] Step 3.6 — Implementar `src/app/[locale]/layout.tsx` con `generateStaticParams():

      [{locale:'es'},{locale:'en'}]` + `NextIntlClientProvider`, y `middleware.ts` con
      `createMiddleware(routing)`.

- [ ] Step 3.7 — Correr `node --test tests/i18n.test.ts` en verde.
- [ ] Step 3.8 — Verificación: correr `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint;

      npm.cmd run build` en verde.

- [ ] Step 3.9 — Commit: `git add -A; git commit -m "task3: i18n es/en + layout + menu tresde +

      switcher"`.

### Task 4 — Home mínima + 3D gigante + spotlights

**Files:**

- Create: `src/components/Spotlights.tsx`, `src/components/Viewer3D.tsx` (v1 procedural),

  `src/components/HomeHero3D.tsx`, `src/app/[locale]/page.tsx`

- Modify: `src/app/globals.css` (fondo oscuro home, spotlight, sin-scroll desktop),

  `scripts/verify.mjs` (1 canvas por página, `ssr:false`, destacada enlazada)

- Test: verificación `grep` en verify (un solo `<canvas>`/dynamic en home, sin `output:export` en

  config)
**Interfaces:**

- Consumes: `src/content/obras.ts -> obraDestacada(): Obra` + `src/i18n/messages/{es,en}.json ->

  home.{subtitulo,titulo,verObra}`

- Produces: `src/components/Viewer3D.tsx -> export default function Viewer3D(props: { modelo:

  string; formato: 'obj'|'stl'; titulo: string; cuadrado?: boolean }): JSX.Element` +
  `src/components/HomeHero3D.tsx -> export default function HomeHero3D(props: { locale: Locale;
  slug: string; titulo: string; modelo?: string; formato?: 'obj'|'stl' }): JSX.Element` +
  `src/components/Spotlights.tsx -> export default function Spotlights(): JSX.Element`
**Steps:**

- [ ] Step 4.1 — Escribir chequeo en `scripts/verify.mjs` que falla si `src/app/[locale]/page.tsx`

      no enlaza al slug de `obraDestacada()` o si hay >1 `dynamic.*ssr:false`/`<canvas>` en home.

- [ ] Step 4.2 — Correr `npm.cmd run verify` y confirmar que FALLA.
- [ ] Step 4.3 — Implementar firma exacta en `src/components/Spotlights.tsx` (dos focos laterales

      CSS puros).

- [ ] Step 4.4 — Implementar firma exacta en `src/components/Viewer3D.tsx` como client (`'use

      client'`, `three` importado solo en cliente, torus-knot/icosaedro procedural, auto-rotación,
      `ResizeObserver`, `formato/modelo` reservados para OBJ/STL reales, 2 `SpotLight`).

- [ ] Step 4.5 — Implementar firma exacta en `src/components/HomeHero3D.tsx` (dynamic `Viewer3D` con

      `ssr:false`, 1 canvas, clic/`Link` a `/[locale]/obra/[slug]` destacada).

- [ ] Step 4.6 — Implementar `src/app/[locale]/page.tsx` (server: subtítulo + `HomeHero3D` gigante

      centrado + título; `h-screen overflow-hidden` en desktop, scroll fallback en móvil; fondo
      oscuro solo aquí).

- [ ] Step 4.7 — Verificación: correr `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint;

      npm.cmd run build` en verde.

- [ ] Step 4.8 — Commit: `git add -A; git commit -m "task4: home minima + 3d gigante + spotlights"`.

### Task 5 — Índices pinturas / dibujos / tresde (agrupados, tarjeta fija)

**Files:**

- Create: `src/components/PlaceholderArt.tsx`, `src/components/TarjetaObra.tsx`,

  `src/components/GrupoPorPeriodo.tsx`, `src/app/[locale]/pinturas/page.tsx`,
  `src/app/[locale]/dibujos/page.tsx`, `src/app/[locale]/tresde/page.tsx`

- Modify: `scripts/verify.mjs` (prohibir `three`/`canvas` en índices, exigir agrupación por

  `PERIODOS`)

- Test: `tests/content.test.ts` (reuso) + verify

**Interfaces:**

- Consumes: `src/content/obras.ts -> obrasPorTipo(tipo: TipoObra): Obra[]` + `src/content/tipos.ts

  -> PERIODOS: Periodo[]`

- Produces: `src/components/PlaceholderArt.tsx -> export default function PlaceholderArt(props: {

  etiqueta: string; titulo: string; className?: string }): JSX.Element` +
  `src/components/TarjetaObra.tsx -> export default function TarjetaObra(props: { locale: Locale;
  slug: string; titulo: string; año: number }): JSX.Element` + `src/components/GrupoPorPeriodo.tsx
  -> export default function GrupoPorPeriodo(props: { locale: Locale; obras: Obra[] }): JSX.Element`
  + páginas `export default function PinturasPage({ params }: { params: { locale: Locale } }):
  JSX.Element` (ídem Dibujos/Tresde)
**Steps:**

- [ ] Step 5.1 — Añadir a `scripts/verify.mjs` chequeo que falla si

      `pinturas|dibujos|tresde/page.tsx` importa `three` o contiene `<canvas>`, o si no itera
      `PERIODOS`.

- [ ] Step 5.2 — Correr `npm.cmd run verify` y confirmar que FALLA (páginas no existen).
- [ ] Step 5.3 — Implementar firma exacta en `src/components/PlaceholderArt.tsx` (gradiente CSS +

      etiqueta, sin `<img>` real).

- [ ] Step 5.4 — Implementar firma exacta en `src/components/TarjetaObra.tsx` (`Link` →

      `/[locale]/obra/[slug]`, `PlaceholderArt` fija + título + año; también para `tipo:'3d'`).

- [ ] Step 5.5 — Implementar firma exacta en `src/components/GrupoPorPeriodo.tsx` (secciones `2026,

      2024–25, 2022–23, 2020–21, 2018–19` en orden, omite periodos vacíos).

- [ ] Step 5.6 — Implementar las 3 páginas de índice (server, una columna, fondo claro) usando

      `obrasPorTipo('pintura'|'dibujo'|'3d')` + `GrupoPorPeriodo`.

- [ ] Step 5.7 — Verificación: correr `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint;

      npm.cmd run build` en verde.

- [ ] Step 5.8 — Commit: `git add -A; git commit -m "task5: indices agrupados pinturas dibujos

      tresde"`.

### Task 6 — Ficha pictórica /obra/[slug] + carrusel

**Files:**

- Create: `src/components/Carrusel.tsx`, `src/components/FichaDatos.tsx`,

  `src/components/AnteriorSiguiente.tsx`, `src/app/[locale]/obra/[slug]/page.tsx`

- Modify: `scripts/verify.mjs` (exigir flechas/contador/overlay/teclado en `Carrusel.tsx`, nav mismo

  tipo)

- Test: typecheck + verify (sin framework; teclado/overlay revisión manual en `next dev`)

**Interfaces:**

- Consumes: `src/content/obras.ts -> obraPorSlug(slug: string): Obra | undefined;

  vecinasDelMismoTipo(slug: string): { anterior: Obra | null; siguiente: Obra | null }`

- Produces: `src/components/Carrusel.tsx -> export default function Carrusel(props: { imagenes: {

  etiqueta: string }[]; titulo: string }): JSX.Element` + `src/components/FichaDatos.tsx -> export
  default function FichaDatos(props: { obra: ObraPictorica | Obra3D; locale: Locale }): JSX.Element`
  + `src/components/AnteriorSiguiente.tsx -> export default function AnteriorSiguiente(props: {
  locale: Locale; anterior: Obra | null; siguiente: Obra | null }): JSX.Element`
**Steps:**

- [ ] Step 6.1 — Añadir a `scripts/verify.mjs` chequeo que falla si `Carrusel.tsx` no contiene `‹`,

      `›`, contador (`/` + `length`), `Escape`, `ArrowLeft/Right` ni overlay (`fixed inset-0
      bg-black`).

- [ ] Step 6.2 — Correr `npm.cmd run verify` y confirmar que FALLA.
- [ ] Step 6.3 — Implementar firma exacta en `src/components/Carrusel.tsx` (client: estado índice,

      flechas grandes ‹ › en costados, contador `2/5`, clic agranda a overlay oscuro, `useEffect`
      teclado ← → / Escape).

- [ ] Step 6.4 — Implementar firma exacta en `src/components/FichaDatos.tsx` (año,

      técnica/materiales localizados, dimensiones neutra, descripción `{es,en}`).

- [ ] Step 6.5 — Implementar firma exacta en `src/components/AnteriorSiguiente.tsx` (links solo a

      vecinas del mismo tipo).

- [ ] Step 6.6 — Implementar `src/app/[locale]/obra/[slug]/page.tsx` con `generateStaticParams()`

      (todas las combinaciones locale×slug) + `notFound()` si slug ausente o `tipo==='3d'` delega a
      viewer (Task 7); ficha pictórica = `Carrusel` (3 `PlaceholderArt`) + `FichaDatos` +
      `AnteriorSiguiente`.

- [ ] Step 6.7 — Revisión manual: correr `npm.cmd run dev`, abrir `/es/obra/<slug-pintura>`, probar

      flechas/contador/overlay/teclado.

- [ ] Step 6.8 — Verificación: correr `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint;

      npm.cmd run build` en verde.

- [ ] Step 6.9 — Commit: `git add -A; git commit -m "task6: ficha pictorica + carrusel overlay

      teclado"`.

### Task 7 — Ficha 3D + viewer cuadrado (orbit/zoom)

**Files:**

- Create: (reuso `Viewer3D.tsx`, `FichaDatos.tsx`, `AnteriorSiguiente.tsx`; loader en

  `src/components/CargadorModelo.ts` si hace falta)

- Modify: `src/components/Viewer3D.tsx` (añadir `OBJLoader`/`STLLoader` real con fallback

  procedural), `src/app/[locale]/obra/[slug]/page.tsx` (rama `tipo==='3d'`), `scripts/verify.mjs` (1
  canvas en ficha 3D, `ssr:false`, sin canvas en listas)

- Test: verify + typecheck + revisión manual orbit/zoom

**Interfaces:**

- Consumes: `src/content/obras.ts -> Obra3D { modelo: string; formato: 'obj'|'stl' }` +

  `Viewer3D(props: { modelo: string; formato: 'obj'|'stl'; titulo: string; cuadrado?: boolean })`

- Produces: `src/components/Viewer3D.tsx (modificado) -> misma firma, internamente export async

  function cargarModelo(url: string, formato: 'obj'|'stl'): Promise<THREE.Object3D>` (usa
  `three/examples/jsm/loaders/OBJLoader.js|STLLoader.js` o `three-stdlib`; si `fetch` falla/404 usa
  torus-knot/icosaedro procedural)`
**Steps:**

- [ ] Step 7.1 — Añadir a `scripts/verify.mjs` chequeo que falla si la rama 3D no usa `Viewer3D`

      cuadrado con `ssr:false` o si hay >1 canvas en la ficha.

- [ ] Step 7.2 — Correr `npm.cmd run verify` y confirmar que FALLA.
- [ ] Step 7.3 — Modificar `Viewer3D.tsx` con firma exacta conservada: añadir `cargarModelo(url,

      formato)`, auto-rotación pausable al arrastrar, `OrbitControls` manual (drag orbita, rueda
      zoom) o `three/examples` si disponible, prop `cuadrado` fuerza `aspect-square`, fondo oscuro +
      2 focos, todo tras `dynamic ssr:false`.

- [ ] Step 7.4 — Modificar `src/app/[locale]/obra/[slug]/page.tsx`: si `obra.tipo==='3d'` renderizar

      `Viewer3D cuadrado` + `FichaDatos` + `AnteriorSiguiente` (vecinas solo `tipo:'3d'`).

- [ ] Step 7.5 — Revisión manual: `npm.cmd run dev`, abrir `/es/obra/<slug-3d>`, probar auto-rota,

      drag orbita, rueda zoom, sin segundo canvas.

- [ ] Step 7.6 — Verificación: correr `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint;

      npm.cmd run build` en verde.

- [ ] Step 7.7 — Commit: `git add -A; git commit -m "task7: ficha 3d + viewer cuadrado orbit zoom"`.

### Task 8 — Biografía + contacto (sin formulario)

**Files:**

- Create: `src/content/biografia.ts`, `src/content/contacto.ts`,

  `src/app/[locale]/biografia/page.tsx`, `src/app/[locale]/contacto/page.tsx`

- Modify: `src/i18n/messages/es.json`, `src/i18n/messages/en.json` (claves `bio.*`, `contacto.*`),

  `scripts/verify.mjs` (simetría bio/contacto, prohibir `<form` en contacto)

- Test: `tests/i18n.test.ts` (extender claves) + verify

**Interfaces:**

- Consumes: `src/i18n/messages/{es,en}.json ->

  bio.{titulo,resumen,individuales,colectivas,reconocimientos},
  contacto.{titulo,galeria,estudio,email,direccion,telefono}`

- Produces: `src/content/biografia.ts -> export interface Biografia { nombre: string; resumen:

  LocalizedText; individuales: LocalizedText[]; colectivas: LocalizedText[]; reconocimientos:
  LocalizedText[] } export const BIOGRAFIA: Biografia` + `src/content/contacto.ts -> export
  interface Contacto { galeria: { nombre: string; direccion: LocalizedText; email: string; telefono:
  string }; estudio: { nombre: string; direccion: LocalizedText; email: string } } export const
  CONTACTO: Contacto`
**Steps:**

- [ ] Step 8.1 — Extender `tests/i18n.test.ts` para exigir claves `bio.*` y `contacto.*` simétricas

      y que `contacto.ts` no contenga `form|submit|input|textarea`.

- [ ] Step 8.2 — Correr `node --test tests/i18n.test.ts` y confirmar que FALLA.
- [ ] Step 8.3 — Implementar firma exacta en `src/content/biografia.ts` (ficticia: 3 individuales, 4

      colectivas, 2 reconocimientos, todo `{es,en}`).

- [ ] Step 8.4 — Implementar firma exacta en `src/content/contacto.ts` (galería + estudio ficticios,

      emails/teléfonos ficticios, direcciones `{es,en}`, sin formulario).

- [ ] Step 8.5 — Implementar `src/app/[locale]/biografia/page.tsx` (server, una columna, listas

      individuales/colectivas/reconocimientos) y `src/app/[locale]/contacto/page.tsx` (server, datos
      galería/estudio como texto/links `mailto:`, ningún `<form>`).

- [ ] Step 8.6 — Añadir claves `bio.*`/`contacto.*` simétricas en `es.json`/`en.json`.
- [ ] Step 8.7 — Verificación: correr `node --test tests/i18n.test.ts; npm.cmd run verify; npm.cmd

      run typecheck; npm.cmd run lint; npm.cmd run build` en verde.

- [ ] Step 8.8 — Commit: `git add -A; git commit -m "task8: biografia + contacto sin formulario"`.

### Task 9 — Diseño futurista (tipografías, blur, hovers, aire)

**Files:**

- Create: ninguno nuevo (estilos en existentes)
- Modify: `src/app/globals.css`, `src/components/SiteNav.tsx`, `src/components/TarjetaObra.tsx`,

  `src/components/PlaceholderArt.tsx`, `src/app/[locale]/layout.tsx`

- Test: `npm.cmd run build` + revisión manual (sin test automatizado; ajuste iterativo posterior

  explícitamente fuera de este task)
**Interfaces:**

- Consumes: tokens CSS en `globals.css` (`--font-titulo`, `--font-cuerpo`)
- Produces: `src/app/globals.css -> @theme { --font-titulo: 'Space Grotesk', sans-serif;

  --font-cuerpo: 'Inter', sans-serif }` + clases `.menu-blur`, `.tarjeta-hover`, `.aire-menu-imagen`
  (nombres exactos)
**Steps:**

- [ ] Step 9.1 — Documentar en `globals.css` estado actual (fondo claro default, oscuro solo

      home/viewer) antes de tocar.

- [ ] Step 9.2 — Implementar en `globals.css` firma exacta: importar `Space Grotesk` (títulos) +

      `Inter` (cuerpo), `@theme` con `--font-titulo/--font-cuerpo`, utilidades `.menu-blur`
      (`backdrop-blur + bg-white/70`), `.tarjeta-hover` (`transition transform hover:-translate-y-1
      hover:scale`), `.aire-menu-imagen` (`padding-top` generoso).

- [ ] Step 9.3 — Modificar `SiteNav.tsx` para usar `.menu-blur` superpuesto (`sticky top-0 z-50`),

      menú pequeño, interruptor ES/EN visible.

- [ ] Step 9.4 — Modificar `TarjetaObra.tsx` + `PlaceholderArt.tsx` para usar `.tarjeta-hover`

      (movimiento en hover) y aire entre menú e imagen.

- [ ] Step 9.5 — Revisión manual: `npm.cmd run dev`, comprobar home oscura vs resto claro, blur

      menú, hovers con movimiento, una columna, aire menú-imagen (anotar ajustes pendientes como
      iteración futura, no bloquear).

- [ ] Step 9.6 — Verificación: correr `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint;

      npm.cmd run build` en verde.

- [ ] Step 9.7 — Commit: `git add -A; git commit -m "task9: diseno futurista blur hovers

      tipografias"`.

### Task 10 — Verify final + typecheck + lint + build verdes

**Files:**

- Modify: `scripts/verify.mjs` (endurecer: conteos, periodos, simetría total, comerciales EN+ES,

  media/textos en todo el repo salvo este plan, rutas `/tresde` sin `/3d`, 1 canvas, destacada
  única, `generateStaticParams` presente, sin `output:export`), `package.json` (confirmar scripts)

- Test: `tests/content.test.ts`, `tests/i18n.test.ts`, `scripts/verify.mjs`

**Interfaces:**

- Consumes: todas las `Produces` de Tasks 1–9
- Produces: `scripts/verify.mjs -> verify(): Promise<{ ok: boolean; errores: string[] }>` final

  (código de salida `0` si verde, `1` + lista si rojo; cubre: 20+4, 5 periodos, simetría,
  comerciales, media/textos, rutas, canvas, destacada, static params)
**Steps:**

- [ ] Step 10.1 — Escribir el endurecimiento final de `scripts/verify.mjs` (todos los invariantes

      del spec en un solo runner con salida `VERIFY OK` o lista numerada de errores).

- [ ] Step 10.2 — Correr `node scripts/verify.mjs` y confirmar estado (verde o lista de rojos a

      corregir task por task).

- [ ] Step 10.3 — Correr `npm.cmd run typecheck` (`tsc --noEmit`) y corregir hasta verde.
- [ ] Step 10.4 — Correr `npm.cmd run lint` (`next lint` o `eslint .`) y corregir hasta verde.
- [ ] Step 10.5 — Correr `npm.cmd run build` (`next build`) y corregir hasta verde (sin

      `output:export`, con `generateStaticParams`).

- [ ] Step 10.6 — Corrida conjunta final: `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run

      lint; npm.cmd run build` todo verde en una sola pasada.

- [ ] Step 10.7 — Commit: `git add -A; git commit -m "task10: verify final + typecheck + lint +

      build verdes"`.
---

## Self-Review (cobertura del spec, escaneo de steps, consistencia, Review Focus, proporción — corregido inline)

- Cobertura spec→tasks: migración+borrado HTML→T1; 20+4/modelos/PlaceholderArt/procedural→T2+T5+T7;

  bilingüe simétrico→T3 (+T8 bio/contacto-labels); rutas
  `/[locale]/pinturas/dibujos/tresde/obra/[slug]/biografia/contacto` (etiqueta "3D", ruta
  `/tresde`)→T3+T5+T6+T7; home sin scroll + gigante + destacada + oscuro + 2 focos→T4; índices
  agrupados 5 periodos + tarjeta fija + prohibido canvas listas→T5; ficha pictórica carrusel
  completo (‹ ›, contador, overlay, ←→/Escape, datos, texto, anterior/siguiente mismo tipo)→T6;
  ficha 3D viewer cuadrado (auto-rota, orbit, zoom, oscuro+focos, datos/nav)→T7; bio listas +
  contacto sin formulario→T8; diseño (claro/oscuro, columna, menú+ES/EN, aire, Space Grotesk+Inter,
  blur, hovers)→T9; verify+typecheck+lint+build+scripts npm→T1+T10; versiones
  Next16/React19/Tailwind4 con `npm.cmd view`→T1 Step 1.1 (verificado hoy: `16.4.0/19.3.0/4.3.3`
  existen, sin fallback necesario); Vercel sin `output:export` + `generateStaticParams`→T1+T6+T10;
  palabras comerciales + media/textos ausentes→T2+T3+T8+T10. Sin huecos: ningún requisito del spec
  queda sin task.

- Escaneo de steps: cada step = una acción (escribir test→correrlo y verlo fallar→implementar firma

  exacta en archivo exacto→verificación→commit); cada task abre con test/verify en rojo y cierra con
  `verify/typecheck/lint/build` + commit; comandos exactos Windows con `npm.cmd` y `node
  scripts/verify.mjs` / `node --test`.

- Consistencia tipos/nombres: `Periodo` con en-dash (`2024–25` etc.) idéntico en

  `tipos.ts/obras.ts/GrupoPorPeriodo/verify`; `TipoObra='pintura'|'dibujo'|'3d'`;
  `LocalizedText={es,en}`; helpers
  `todasLasObras/obraPorSlug/obrasPorTipo/vecinasDelMismoTipo/obraDestacada`; componentes
  `Viewer3D/HomeHero3D/Spotlights/PlaceholderArt/TarjetaObra/GrupoPorPeriodo/Carrusel/FichaDatos/AnteriorSiguiente/LocaleSwitcher/SiteNav`;
  ruta `tresde` nunca `3d`; `destacada?: boolean` única; `modelo+formato: obj|stl` solo en 3d.
  Corregido inline: se fijaron firmas exactas en cada task para evitar deriva.

- Review Focus con tests asignados: simetría→`tests/i18n.test.ts`+verify (T2,T3,T8,T10); integridad

  20+4/periodos/destacada→`tests/content.test.ts`+verify (T2,T10); rutas/nav→verify
  `tresde`/static-params (T3,T5,T6,T7,T10); 1 canvas/listas sin canvas/`ssr:false`→verify grep
  (T4,T5,T7,T10); diseño/accesibilidad carrusel+viewer→revisión manual + build (T4,T6,T7,T9).

- Proporción: 10 tasks pequeños cada uno con deliverable testeable propio; ningún task supera ~9

  steps; T9 (diseño) deliberadamente sin test automatizado por ajuste iterativo posterior declarado
  en el spec; T10 es solo endurecimiento+verdes finales sin código nuevo de producto.

## Mapa del documento

- [[#Task 1 — Scaffold Next.js 16 + limpieza + toolchain + verify esqueleto]]
- [[#Task 2 — Tipos + contenido ficticio (20 pictóricas + 4 3d) + tests de contenido]]
- [[#Task 3 — i18n (ES default + EN) + layout + menú ES/EN]]
- [[#Task 4 — Home mínima + 3D gigante + spotlights]]
- [[#Task 5 — Índices pinturas / dibujos / tresde (agrupados, tarjeta fija)]]
- [[#Task 6 — Ficha pictórica /obra/[slug] + carrusel]]
- [[#Task 7 — Ficha 3D + viewer cuadrado (orbit/zoom)]]
- [[#Task 8 — Biografía + contacto (sin formulario)]]
- [[#Task 9 — Diseño futurista (tipografías, blur, hovers, aire)]]
- [[#Task 10 — Verify final + typecheck + lint + build verdes]]
