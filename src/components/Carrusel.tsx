"use client";

import { useCallback, useEffect, useState } from "react";
import PlaceholderArt from "./PlaceholderArt";

export default function Carrusel({
  imagenes,
  titulo
}: {
  imagenes: { etiqueta: string }[];
  titulo: string;
}) {
  const n = imagenes.length;
  const [indice, setIndice] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const ir = useCallback(
    (d: number) => setIndice((i) => (i + d + n) % n),
    [n]
  );

  useEffect(() => {
    if (!ampliada) {
      return;
    }
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        ir(-1);
      } else if (e.key === "ArrowRight") {
        ir(1);
      } else if (e.key === "Escape") {
        setAmpliada(false);
      }
    };
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
  }, [ampliada, ir]);

  const actual = imagenes[indice];
  return (
    <div className="carrusel">
      <button type="button" className="flecha flecha-izq" onClick={() => ir(-1)} aria-label="Anterior">
        ‹
      </button>
      <button
        type="button"
        className="carrusel-imagen"
        onClick={() => setAmpliada(true)}
        aria-label={titulo + " ampliar"}
      >
        <PlaceholderArt etiqueta={actual.etiqueta} titulo={titulo} />
      </button>
      <button type="button" className="flecha flecha-der" onClick={() => ir(1)} aria-label="Siguiente">
        ›
      </button>
      <p className="contador" aria-live="polite">
        {indice + 1}/{imagenes.length}
      </p>
      {ampliada && (
        <div
          className="fixed inset-0 bg-black overlay"
          onClick={() => setAmpliada(false)}
          role="dialog"
          aria-modal="true"
          aria-label={titulo}
        >
          <button
            type="button"
            className="flecha flecha-izq"
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              ir(-1);
            }}
          >
            ‹
          </button>
          <div className="overlay-imagen" onClick={(e) => e.stopPropagation()}>
            <PlaceholderArt etiqueta={actual.etiqueta} titulo={titulo} />
          </div>
          <button
            type="button"
            className="flecha flecha-der"
            aria-label="Siguiente"
            onClick={(e) => {
              e.stopPropagation();
              ir(1);
            }}
          >
            ›
          </button>
          <p className="contador">
            {indice + 1}/{imagenes.length}
          </p>
          <button
            type="button"
            className="overlay-cerrar"
            aria-label="Cerrar"
            onClick={() => setAmpliada(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
