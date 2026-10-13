---
title: Guía de diseño
tags: [docs, diseno]
---

# Guía de diseño

Estética: oscuro global (`#0a0a0f`), tipografía futurista solo en títulos (Space Grotesk) + Inter en cuerpo, menús translúcidos superpuestos, hovers con movimiento, haces de luz laterales.

## Clases (en `src/app/globals.css`)

- `.menu-blur` barra fija oscura translúcida; `.nav-enlaces` centro; `.interruptor` ES/EN a la derecha; `.marca` nombre + `.marca-foto` retrato que sigue al puntero.
- Home: `.home-viewport` (encaja en 100dvh en desktop), `.home-oscura`, `.heroe-3d` a pantalla completa, `.visor`, `.focos` con `.foco-izq` (verde) y `.foco-der` (violeta).
- Índices: `.indice` (1080px), `.grupos`, `.tarjetas` (grilla 2 col móvil, 4 col desktop), `.tarjeta-hover`, `.placeholder`.
- Ficha: `.ficha`, `.carrusel`, `.flecha`, `.contador`, `.overlay`, `.ficha-datos`, `.anterior-siguiente`.
- `.pie` barra inferior oscura con © + año dinámico.

## 3D

`Viewer3D` (cliente, `ssr:false`): auto-rotación, órbita con arrastre, zoom con rueda, 2 SpotLight + ambiente. Easter egg solo en home (`glitchZoom`): 4 variantes de color sin repetir al arrastrar o zoomear. El título de la home tiene su propio glitch RGB (clase `.glitch`, respeta `prefers-reduced-motion`).

## Pendientes visuales

- Revisión real en navegador y móvil (todo se verificó en código + SSR).
- Ajuste fino de tamaños del modelo y textos superpuestos.
- Fotos reales y modelos OBJ/STL del artista.
