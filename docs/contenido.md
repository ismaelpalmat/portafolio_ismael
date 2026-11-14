---
title: Guía de contenido
tags: [docs, contenido]
---

# Guía de contenido

Todo el contenido vive en código (sin CMS). En construcción, las obras se llaman `test_N` y los campos muestran el tipo de dato (`Técnica`, `Materiales`, `Medidas`, `Descripción`); los conteos mínimos son 20 pictóricas + 4 3D (ver `scripts/verify.mjs`).

## Obras (`src/content/obras.ts`)

Cada obra: `slug` único (`test-N`), `periodo` (uno de los 5 válidos), `anio`, `tipo`, `titulo/tecnica/materiales/descripcion` en `{es,en}`, `dimensiones` en `{es,en}` (`Medidas`/`Dimensions`), `imagenes` (vistas placeholder). Las 3D suman `modelo` (`/models/test-N.obj`) y `formato` (`obj|stl`). Solo una obra lleva `destacada:true`: `test_1`, la que enlaza la home.

Helpers: `obraPorSlug`, `obrasPorTipo`, `vecinasDelMismoTipo`, `obraDestacada`, `todasLasObras`. Tipos en `src/content/tipos.ts`.

## Reglas de texto

- Todo visible en ES y EN, sin vacíos.
- Sin secciones media/textos. Cuidado con subcadenas que activan el verificador (aprecio, mediana). El shop es la excepción comercial: sin carrito, checkout, pagos ni formularios.

## Fotos

Los cuadros grises con etiqueta son `PlaceholderArt` (`src/components/PlaceholderArt.tsx`). Al llegar fotos reales se reemplaza ese componente por `next/image` optimizada. El retrato del menú es el 3D `head_1.glb` (visor al hover).

## Modelos 3D (`public/models/`)

Subir `.obj` o `.stl` livianos (three.js ya pesa unos 136 KB comprimido). `Viewer3D` intenta cargarlos con `cargarModelo` y si falla usa geometría procedural. El canvas es transparente y las luces verde/violeta se adaptan al tema (claro/oscuro).

## Bio y contacto

`src/content/biografia.ts` (nombre, resumen, individuales, colectivas, residencias, reconocimientos) y `src/content/contacto.ts` (correo e Instagram). Etiquetas en `src/i18n/messages/{es,en}.json` (claves `bio.*`, `contacto.*`, `footer.*`). Contacto sin formulario por diseño.

## Shop

`src/content/productos.ts` (piezas `test_1`..`test_6` con monto `—`) y `src/app/[locale]/shop/page.tsx` (panel blanco, grilla de dos columnas). Es solo vitrina: sin carrito, checkout, pagos ni formularios. Las imágenes son placeholders.
