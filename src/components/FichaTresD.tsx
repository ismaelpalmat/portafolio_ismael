"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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
  const caja = useRef<HTMLDivElement>(null);
  const [pantalla, setPantalla] = useState(false);
  const [fija, setFija] = useState(false);
  useEffect(() => {
    const alCambiar = () => {
      const activo = Boolean(document.fullscreenElement);
      setPantalla(activo);
      if (activo) {
        setFija(false);
      }
    };
    document.addEventListener("fullscreenchange", alCambiar);
    return () => document.removeEventListener("fullscreenchange", alCambiar);
  }, []);
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFija(false);
      }
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, []);
  const alternarPantalla = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (fija) {
      setFija(false);
      return;
    }
    try {
      const pedido = caja.current?.requestFullscreen();
      pedido?.catch(() => setFija(true));
    } catch {
      setFija(true);
      return;
    }
    window.setTimeout(() => {
      if (!document.fullscreenElement) {
        setFija(true);
      }
    }, 600);
  };
  const enPantalla = pantalla || fija;
  const enfocar = (n: string | null) => {
    setNodo(n);
    const f = n && fichas ? fichas[n] : null;
    if (f) {
      setUltima(f);
    }
  };
  return (
    <div className={fija ? "visor-caja visor-caja-fija" : "visor-caja"} ref={caja}>
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
      <button
        type="button"
        className="visor-pantalla"
        onClick={alternarPantalla}
        aria-label={enPantalla ? t("salirPantalla") : t("pantallaCompleta")}
        title={enPantalla ? t("salirPantalla") : t("pantallaCompleta")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {enPantalla ? (
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
          ) : (
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          )}
        </svg>
      </button>
    </div>
  );
}
