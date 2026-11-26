"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";
import FichaObra, { type FichaObraDatos } from "./FichaObra";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

export default function FichaTresD({
  modelo,
  formato,
  titulo,
  recorrer,
  mirar,
  fichas
}: {
  modelo: string;
  formato: "obj" | "stl" | "glb";
  titulo: string;
  recorrer?: boolean;
  mirar?: string;
  fichas?: Record<string, FichaObraDatos>;
}) {
  const t = useTranslations("ficha");
  // shortcut: el ancho se lee al cargar; girar el teléfono no cambia el modo hasta recargar.
  const [esMovil] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [nodo, setNodo] = useState<string | null>(null);
  const [ultima, setUltima] = useState<FichaObraDatos | null>(null);
  const enfocar = (n: string | null) => {
    setNodo(n);
    const f = n && fichas ? fichas[n] : null;
    if (f) {
      setUltima(f);
    }
  };
  return (
    <>
      <Viewer3D
        modelo={modelo}
        formato={formato}
        titulo={titulo}
        cuadrado
        distancia={3.8}
        recorrer={recorrer && !esMovil}
        mirar={mirar}
        onEnfocar={enfocar}
        reservaProcedural={modelo === ""}
        aviso={t("modeloPendiente")}
      />
      <FichaObra ficha={nodo && fichas ? (fichas[nodo] ?? null) : null} respaldo={ultima} />
    </>
  );
}
