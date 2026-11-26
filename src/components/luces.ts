export type FocoRiel = { x: number; z: number; alto: number; potencia: number; blend: number };
export type FocoObra = { nombre: string; potencia: number; dx: number; dy: number; dz: number };

export const RIEL: FocoRiel[] = [
  { x: -4.05, z: -1.35, alto: 3.05, potencia: 1.95, blend: 0.5 },
  { x: -3.25, z: -1.35, alto: 3, potencia: 2.1, blend: 0.5 },
  { x: -2.25, z: -1.1, alto: 3, potencia: 2.7, blend: 0.45 },
  { x: -2.65, z: -1.14, alto: 3.05, potencia: 1, blend: 0.9 },
  { x: -4.5, z: -1.1, alto: 3.05, potencia: 1.2, blend: 0.9 },
  { x: -4.3, z: -0.25, alto: 3.05, potencia: 0, blend: 0.9 },
  { x: -4.55, z: 0.15, alto: 2.8, potencia: 0.7, blend: 0.4 },
  { x: -4.45, z: 0.1, alto: 2.8, potencia: 0.7, blend: 0.9 },
  { x: -4.4, z: 1.2, alto: 2.95, potencia: 1.8, blend: 0.6 },
  { x: -4.3, z: 0.2, alto: 3.05, potencia: 1, blend: 0.9 },
  { x: -1.7, z: -1.05, alto: 2.8, potencia: 1.15, blend: 0.55 },
  { x: -2, z: -0.25, alto: 3.05, potencia: 1.9, blend: 0.35 },
  { x: -1.35, z: 1.5, alto: 2.8, potencia: 1.35, blend: 0.9 }
];

export const OBRAS: FocoObra[] = [
  { nombre: "Plane.004", potencia: 0, dx: 0, dy: 0, dz: 0 },
  { nombre: "Text.003", potencia: 0.15, dx: -0.01, dy: 0.03, dz: -0.08 },
  { nombre: "dibujo mañio", potencia: 0.05, dx: -0.02, dy: 0.15, dz: 0.01 },
  { nombre: "paisaje_hztl_mañio", potencia: 0.05, dx: -0.07, dy: 0.1, dz: 0 }
];

// Cuánto ilumina el ambiente lo que no tiene foco; bajarlo oscurece las esquinas y hace resaltar las obras.
export const AMBIENTE = 0.3;

// Cuánto absorben las paredes: 1 es el color original, menos es más oscuro y sólido.
export const PAREDES = 0.45;

const n = (v: number) => String(Number(v.toFixed(2)));

export function obrasEditor(mirar?: string): { obras: FocoObra[]; objetivos: string[] } {
  return {
    obras: OBRAS.map((f) => ({ ...f })),
    objetivos: OBRAS.map((f, i) => (i === 0 && mirar ? mirar : f.nombre))
  };
}

export async function copiar(
  texto: string,
  portapapeles?: { writeText: (t: string) => Promise<void> }
): Promise<boolean> {
  try {
    if (!portapapeles) {
      return false;
    }
    await portapapeles.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

export function codigoFocos(riel: FocoRiel[], obra: FocoObra[], ambiente: number, paredes: number): string {
  const filasRiel = riel.map(
    (f) =>
      `  { x: ${n(f.x)}, z: ${n(f.z)}, alto: ${n(f.alto)}, potencia: ${n(f.potencia)}, blend: ${n(f.blend)} }`
  );
  const filasObra = obra.map(
    (f) =>
      `  { nombre: ${JSON.stringify(f.nombre)}, potencia: ${n(f.potencia)}, dx: ${n(f.dx)}, dy: ${n(f.dy)}, dz: ${n(f.dz)} }`
  );
  return `export const AMBIENTE = ${n(ambiente)};\n\nexport const PAREDES = ${n(paredes)};\n\nexport const RIEL: FocoRiel[] = [\n${filasRiel.join(",\n")}\n];\n\nexport const OBRAS: FocoObra[] = [\n${filasObra.join(",\n")}\n];\n`;
}
