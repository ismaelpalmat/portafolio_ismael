---
title: Guía de despliegue
tags: [docs, despliegue]
---

# Guía de despliegue

- Remoto: `portafolio_ismael` en GitHub (reemplaza al viejo `portafolio1`).
- Producción: rama `main`. Rama `vitrina-3d` ya integrada (se puede borrar).
- Vercel: importar el repo, framework Next.js por defecto, desplegar `main`. Cada push genera preview.

## Publicar un cambio

1. Trabajar y commitear (en rama o directo en `main` si es chico).
2. Correr `npm.cmd run verify`, `typecheck`, `lint`, `build` (todo verde).
3. `git push origin main` (o abrir PR).
4. Revisar el preview de Vercel en navegador real antes de anunciar.

## Rollback

`git revert <commit>` + push, o redeploy de un deployment anterior desde el dashboard de Vercel.

## Checklist visual del preview

Drag y zoom en el 3D de la home, carrusel con teclado, switch ES/EN conservando ruta, home sin scroll en desktop, pie visible, menú centrado.
