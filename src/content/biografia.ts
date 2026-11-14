import type { LocalizedText } from "./tipos.ts";

export interface Biografia {
  nombre: string;
  resumen: LocalizedText;
  individuales: LocalizedText[];
  colectivas: LocalizedText[];
  residencias: LocalizedText[];
  reconocimientos: LocalizedText[];
}

// Nombres de exhibiciones y salas se mantienen en su idioma original.
const texto = (s: string): LocalizedText => ({ es: s, en: s });

export const BIOGRAFIA: Biografia = {
  nombre: "Ismael Palma Téllez",
  resumen: {
    es: "Artista visual que trabaja en Santiago de Chile. Explora distintos medios, como la pintura, el dibujo y la escultura.",
    en: "Visual artist working in Santiago, Chile. Explores different disciplines, such as painting, drawing and sculpture."
  },
  individuales: [
    texto("2022 — Borrar y Rebobinar, Sala Juan Egenau"),
    texto("2018 — Ocasiones Propicias, Espacio O")
  ],
  colectivas: [
    texto("2025 — Tarapacá Expandida, Museo Regional de Iquique"),
    texto("2018 — Trampa para Pájaros, Sala Juan Egenau"),
    texto("2015 — Encuentros Sonoros, Sala Juan Egenau")
  ],
  residencias: [
    texto("2023 — Residencia Submarina, FAST, Quintay")
  ],
  reconocimientos: []
};
