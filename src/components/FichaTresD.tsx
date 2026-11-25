"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

export default function FichaTresD({
  modelo,
  formato,
  titulo,
  recorrer,
  mirar
}: {
  modelo: string;
  formato: "obj" | "stl" | "glb";
  titulo: string;
  recorrer?: boolean;
  mirar?: string;
}) {
  const t = useTranslations("ficha");
  return (
    <Viewer3D
      modelo={modelo}
      formato={formato}
      titulo={titulo}
      cuadrado
      distancia={3.8}
      recorrer={recorrer}
      mirar={mirar}
      reservaProcedural={modelo === ""}
      aviso={t("modeloPendiente")}
    />
  );
}
