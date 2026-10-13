"use client";

import dynamic from "next/dynamic";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

export default function FichaTresD({
  modelo,
  formato,
  titulo
}: {
  modelo: string;
  formato: "obj" | "stl";
  titulo: string;
}) {
  return <Viewer3D modelo={modelo} formato={formato} titulo={titulo} cuadrado />;
}
