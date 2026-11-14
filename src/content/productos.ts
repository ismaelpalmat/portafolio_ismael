import type { LocalizedText } from "./tipos.ts";

export interface Producto {
  slug: string;
  nombre: LocalizedText;
  monto: string;
}

// Piezas y montos de ejemplo: reemplazar por los reales.
export const PRODUCTOS: Producto[] = [
  {
    slug: "toroide-de-lluvia",
    nombre: { es: "Toroide de lluvia", en: "Rain torus" },
    monto: "$130.00"
  },
  {
    slug: "semilla-hueca",
    nombre: { es: "Semilla hueca", en: "Hollow seed" },
    monto: "$130.00"
  },
  {
    slug: "arco-de-sal",
    nombre: { es: "Arco de sal", en: "Salt arch" },
    monto: "$130.00"
  },
  {
    slug: "nido-de-alambre",
    nombre: { es: "Nido de alambre", en: "Wire nest" },
    monto: "$130.00"
  },
  {
    slug: "ola-cuadrada",
    nombre: { es: "Ola cuadrada", en: "Square wave" },
    monto: "$130.00"
  },
  {
    slug: "duna",
    nombre: { es: "Duna", en: "Dune" },
    monto: "$130.00"
  }
];
