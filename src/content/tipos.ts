export type Locale = "es" | "en";

export interface LocalizedText {
  es: string;
  en: string;
}

export type Periodo = "2026" | "2024–25" | "2022–23" | "2020–21" | "2018–19";

export const PERIODOS: Periodo[] = ["2026", "2024–25", "2022–23", "2020–21", "2018–19"];

export type TipoObra = "pintura" | "dibujo" | "3d";

export interface ObraPictorica {
  slug: string;
  periodo: Periodo;
  anio: number;
  tipo: "pintura" | "dibujo";
  titulo: LocalizedText;
  tecnica: LocalizedText;
  materiales: LocalizedText;
  dimensiones: string;
  descripcion: LocalizedText;
  imagenes: number;
  destacada?: boolean;
}

export interface Obra3D {
  slug: string;
  periodo: Periodo;
  anio: number;
  tipo: "3d";
  titulo: LocalizedText;
  tecnica: LocalizedText;
  materiales: LocalizedText;
  dimensiones: string;
  descripcion: LocalizedText;
  modelo: string;
  formato: "obj" | "stl" | "glb";
  imagenes: number;
  destacada?: boolean;
}

export type Obra = ObraPictorica | Obra3D;

export function esLocalizado(v: unknown): v is LocalizedText {
  if (typeof v !== "object" || v === null) {
    return false;
  }
  const o = v as Record<string, unknown>;
  return typeof o.es === "string" && typeof o.en === "string";
}
