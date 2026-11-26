export type FocoRiel = { x: number; z: number; alto: number; potencia: number };
export type FocoObra = { nombre: string; potencia: number; dx: number; dy: number; dz: number };

export const RIEL: FocoRiel[] = [
  { x: -3.8, z: -1.14, alto: 3.05, potencia: 1 },
  { x: -3.35, z: -1.14, alto: 3.05, potencia: 1 },
  { x: -2.92, z: -1.14, alto: 3.05, potencia: 1 },
  { x: -2.65, z: -1.14, alto: 3.05, potencia: 1 },
  { x: -4.27, z: -0.51, alto: 3.05, potencia: 1 },
  { x: -4.27, z: -0.25, alto: 3.05, potencia: 1 },
  { x: -4.27, z: 0.18, alto: 3.05, potencia: 1 },
  { x: -4.27, z: 0.63, alto: 3.05, potencia: 1 },
  { x: -4.27, z: 1.01, alto: 3.05, potencia: 1 },
  { x: -3.8, z: 1.01, alto: 3.05, potencia: 1 },
  { x: -1.89, z: -0.6, alto: 3.05, potencia: 1 },
  { x: -1.89, z: 0.88, alto: 3.05, potencia: 1 },
  { x: -1.89, z: 1.15, alto: 3.05, potencia: 1 }
];

export const OBRAS: FocoObra[] = [
  { nombre: "Plane.004", potencia: 0.5, dx: 0, dy: 0, dz: 0 },
  { nombre: "Text.003", potencia: 0.2, dx: 0, dy: 0, dz: 0 },
  { nombre: "dibujo mañio", potencia: 0.5, dx: 0, dy: 0, dz: 0 },
  { nombre: "paisaje_hztl_mañio", potencia: 0.5, dx: 0, dy: 0, dz: 0 }
];

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

export function codigoFocos(riel: FocoRiel[], obra: FocoObra[]): string {
  const filasRiel = riel.map(
    (f) => `  { x: ${n(f.x)}, z: ${n(f.z)}, alto: ${n(f.alto)}, potencia: ${n(f.potencia)} }`
  );
  const filasObra = obra.map(
    (f) =>
      `  { nombre: ${JSON.stringify(f.nombre)}, potencia: ${n(f.potencia)}, dx: ${n(f.dx)}, dy: ${n(f.dy)}, dz: ${n(f.dz)} }`
  );
  return `export const RIEL: FocoRiel[] = [\n${filasRiel.join(",\n")}\n];\n\nexport const OBRAS: FocoObra[] = [\n${filasObra.join(",\n")}\n];\n`;
}
