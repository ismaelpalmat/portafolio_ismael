---
title: Guía de contenido
tags: [docs, contenido]
---

# Guía de contenido

Todo el contenido vive en código (sin CMS). Mientras sea ficticio, los conteos mínimos son 20 pictóricas + 4 3D (ver `scripts/verify.mjs`).

## Obras (`src/content/obras.ts`)

Cada obra: `slug` único, `periodo` (uno de los 5 válidos), `anio`, `tipo`, `titulo/tecnica/materiales/descripcion` en `{es,en}`, `dimensiones` (texto neutro), `imagenes` (vistas placeholder). Las 3D suman `modelo` (`/models/archivo.obj`) y `formato` (`obj|stl`). Solo una obra lleva `destacada:true`: es la que enlaza la home.

Helpers: `obraPorSlug`, `obrasPorTipo`, `vecinasDelMismoTipo`, `obraDestacada`, `todasLasObras`. Tipos en `src/content/tipos.ts`.

## Reglas de texto

- Todo visible en ES y EN, sin vacíos.
- Nada comercial ni secciones media/textos. Cuidado con subcadenas que activan el verificador (cartón, workshop, aprecio, mediana).

## Fotos

Los cuadros grises con etiqueta son `PlaceholderArt` (`src/components/PlaceholderArt.tsx`). Al llegar fotos reales se reemplaza ese componente por `next/image` optimizada. El retrato del menú es un SVG de ejemplo en CSS (`.marca-foto`); la foto real entra ahí con el mismo grano térmico.

## Modelos 3D (`public/models/`)

Subir `.obj` o `.stl` livianos (three.js ya pesa unos 136 KB comprimido). `Viewer3D` intenta cargarlos con `cargarModelo` y si falla usa geometría procedural. Focos actuales: verde suave izquierda + violeta derecha, difusos.

## Bio y contacto

`src/content/biografia.ts` (nombre, resumen, 3 individuales, 4 colectivas, 2 reconocimientos) y `src/content/contacto.ts` (galería + estudio, datos ficticios). Etiquetas en `src/i18n/messages/{es,en}.json` (claves `bio.*`, `contacto.*`, `footer.*`). Contacto sin formulario por diseño.
