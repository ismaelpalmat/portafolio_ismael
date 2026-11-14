import type { LocalizedText } from "./tipos.ts";

export interface Producto {
  slug: string;
  nombre: LocalizedText;
  monto: string;
}

// Piezas y montos de ejemplo: reemplazar por los reales.
export const PRODUCTOS: Producto[] = [
  {
    slug: "test-1",
    nombre: { es: "test_1", en: "test_1" },
    monto: "—"
  },
  {
    slug: "test-2",
    nombre: { es: "test_2", en: "test_2" },
    monto: "—"
  },
  {
    slug: "test-3",
    nombre: { es: "test_3", en: "test_3" },
    monto: "—"
  },
  {
    slug: "test-4",
    nombre: { es: "test_4", en: "test_4" },
    monto: "—"
  },
  {
    slug: "test-5",
    nombre: { es: "test_5", en: "test_5" },
    monto: "—"
  },
  {
    slug: "test-6",
    nombre: { es: "test_6", en: "test_6" },
    monto: "—"
  }
];
