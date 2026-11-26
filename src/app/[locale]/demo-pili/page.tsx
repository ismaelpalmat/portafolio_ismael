import { notFound } from "next/navigation";
import FichaTresD from "@/components/FichaTresD";
import type { FichaObraDatos } from "@/components/FichaObra";

//solo para desarrollo: en el export no existe
const CLAVES = [
  "Plane001",
  "Plane004",
  "Plane005",
  "Plane006",
  "Plane021",
  "dibujo_mañio",
  "paisaje_hztl_mañio"
];

const FICHAS: Record<string, FichaObraDatos> = Object.fromEntries(
  CLAVES.map((clave, i) => [
    clave,
    {
      titulo: `Obra de prueba ${i + 1}`,
      tecnica: "Óleo sobre tela",
      materiales: "Tela",
      medidas: "80 × 60 cm",
      descripcion: "Ficha de demostración: aparece al enmarcar la obra en el recorrido.",
      disponible: i % 2 === 0,
      ...(i % 2 === 0 ? { monto: "$ 1.200.000" } : {})
    }
  ])
);

export default async function DemoPili({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return (
    <section className="ficha ficha-3d">
      <div className="ficha-3d-caja">
        <FichaTresD
          modelo="/models/Gallery+_map_1.glb"
          formato="glb"
          titulo="Demo del visor"
          recorrer
          mirar="Plane.004"
          fichas={FICHAS}
        />
        <div className="ficha-3d-info">
          <p>Demo de la ficha al enmarcar: haz clic en una obra. Al soltarla se desvanece; si dejas el puntero encima, se queda.</p>
        </div>
      </div>
    </section>
  );
}
