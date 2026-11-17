---
title: Guía de despliegue
tags: [docs, despliegue]
---

# Guía de despliegue

- Remoto: `portafolio_ismael` en GitHub (reemplaza al viejo `portafolio1`).
- Producción: rama `main`.
- GitHub Pages: workflow `.github/workflows/pages.yml` corre verify, lint y tests, luego construye sin base path (dominio propio en la raíz) y publica `out/`. URL: `https://ismael.palmatellez.cl/`. Cada push a `main` redespliega; si una revisión falla, no se publica.

## Publicar un cambio

1. Trabajar y commitear (en rama o directo en `main` si es chico).
2. Correr `npm.cmd run verify`, `typecheck`, `lint`, `node --test tests/*.test.ts`, `build` (todo verde).
3. `git push origin main` (o abrir PR).
4. Revisar la publicación en navegador real antes de anunciar.

## Rollback

`git revert <commit>` + push y el workflow publica de nuevo.

## Checklist visual del preview

Drag y zoom en el 3D de la home, carrusel con teclado, switch ES/EN conservando ruta, home sin scroll en desktop, pie visible, menú centrado.
