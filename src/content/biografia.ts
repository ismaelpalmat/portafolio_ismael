import type { LocalizedText } from "./tipos.ts";

export interface Biografia {
  nombre: string;
  resumen: LocalizedText;
  individuales: LocalizedText[];
  colectivas: LocalizedText[];
  reconocimientos: LocalizedText[];
}

export const BIOGRAFIA: Biografia = {
  nombre: "Ismael Palma Téllez",
  resumen: {
    es: "Pinta y dibuja desde hace más de una década. Su obra explora el agua, la casa y la memoria familiar.",
    en: "He has painted and drawn for over a decade. His work explores water, home and family memory."
  },
  individuales: [
    {
      es: "2024 — Marea y sal, Galería Norte, Ciudad",
      en: "2024 — Tide and Salt, North Gallery, City"
    },
    {
      es: "2021 — Patio interior, Sala del Río, Ciudad",
      en: "2021 — Inner Courtyard, River Hall, City"
    },
    {
      es: "2018 — Primeras casas, Casa de la Luz, Ciudad",
      en: "2018 — First Houses, House of Light, City"
    }
  ],
  colectivas: [
    {
      es: "2025 — Feria de Primavera, Pabellón Central, Ciudad",
      en: "2025 — Spring Fair, Central Pavilion, City"
    },
    {
      es: "2023 — Doce dibujantes, Sala del Río, Ciudad",
      en: "2023 — Twelve Draftsmen, River Hall, City"
    },
    {
      es: "2020 — Ventanas abiertas, muestra en línea",
      en: "2020 — Open Windows, online show"
    },
    {
      es: "2019 — Barrio vivo, Casa de la Luz, Ciudad",
      en: "2019 — Living Quarter, House of Light, City"
    }
  ],
  reconocimientos: [
    {
      es: "2022 — Beca de creación, Fondo de las Artes",
      en: "2022 — Creation grant, Arts Fund"
    },
    {
      es: "2019 — Mención del jurado, Feria de Primavera",
      en: "2019 — Jury mention, Spring Fair"
    }
  ]
};
