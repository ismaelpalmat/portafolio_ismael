"use client";

import { useState } from "react";

export type FichaObraDatos = {
  titulo: string;
  tecnica: string;
  materiales: string;
  medidas: string;
  descripcion: string;
  disponible: boolean;
  monto?: string;
};

const etiquetasPorDefecto = {
  tecnica: "Técnica",
  materiales: "Materiales",
  medidas: "Medidas",
  disponible: "Disponible",
  noDisponible: "No disponible"
};

export default function FichaObra({
  ficha,
  respaldo = null,
  etiquetas = etiquetasPorDefecto
}: {
  ficha: FichaObraDatos | null;
  respaldo?: FichaObraDatos | null;
  etiquetas?: typeof etiquetasPorDefecto;
}) {
  const [hover, setHover] = useState(false);
  const datos = ficha ?? respaldo;
  if (!datos) {
    return null;
  }
  const visible = Boolean(ficha) || hover;
  return (
    <aside
      className={visible ? "ficha-obra ficha-obra-visible" : "ficha-obra"}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      aria-live="polite"
    >
      <h2>{datos.titulo}</h2>
      <dl>
        <dt>{etiquetas.tecnica}</dt>
        <dd>{datos.tecnica}</dd>
        <dt>{etiquetas.materiales}</dt>
        <dd>{datos.materiales}</dd>
        <dt>{etiquetas.medidas}</dt>
        <dd>{datos.medidas}</dd>
      </dl>
      <p>{datos.descripcion}</p>
      <p className="ficha-obra-estado">{datos.disponible ? etiquetas.disponible : etiquetas.noDisponible}</p>
      {datos.disponible && datos.monto ? <p className="ficha-obra-monto">{datos.monto}</p> : null}
    </aside>
  );
}
