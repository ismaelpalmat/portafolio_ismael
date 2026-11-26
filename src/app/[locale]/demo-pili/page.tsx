import { notFound } from "next/navigation";
import FichaTresD from "@/components/FichaTresD";
import type { FichaObraDatos } from "@/components/FichaObra";

//solo para desarrollo: en el export no existe
const FICHAS: Record<string, FichaObraDatos> = {
  Plane006_3: {
    titulo: "Paisaje de prueba",
    tecnica: "Óleo sobre tela",
    materiales: "Tela",
    medidas: "80 × 60 cm",
    descripcion: "Ficha de demostración: aparece al enmarcar la obra en el recorrido.",
    disponible: true,
    monto: "$ 1.200.000"
  },
  Plane021_3: {
    titulo: "Retrato de prueba",
    tecnica: "Óleo sobre tela",
    materiales: "Tela",
    medidas: "60 × 50 cm",
    descripcion: "Esta obra figura como no disponible, así que no muestra monto.",
    disponible: false
  }
};

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
          <p>Demo de la ficha al enmarcar: hacé clic en una obra. Al soltarla se desvanece; si dejás el puntero encima, se queda.</p>
        </div>
      </div>
    </section>
  );
}
