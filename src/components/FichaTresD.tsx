"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

export default function FichaTresD({
  modelo,
  formato,
  titulo
}: {
  modelo: string;
  formato: "obj" | "stl" | "glb";
  titulo: string;
}) {
  const t = useTranslations("ficha");
  return (
    <Viewer3D
      modelo={modelo}
      formato={formato}
      titulo={titulo}
      cuadrado
      distancia={3.8}
      reservaProcedural={modelo === ""}
      aviso={t("modeloPendiente")}
    />
  );
}
