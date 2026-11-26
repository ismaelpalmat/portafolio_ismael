"use client";

import { useState } from "react";
import { codigoFocos, copiar, type FocoObra, type FocoRiel } from "./luces";

function Campo({
  etiqueta,
  valor,
  min,
  max,
  paso,
  alCambiar
}: {
  etiqueta: string;
  valor: number;
  min: number;
  max: number;
  paso: number;
  alCambiar: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-1">
      <span className="w-6 shrink-0 text-neutral-500">{etiqueta}</span>
      <input
        type="range"
        className="h-3 w-full accent-neutral-800"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => alCambiar(Number(e.target.value))}
      />
      <output className="w-8 shrink-0 text-right tabular-nums">{Number(valor.toFixed(2))}</output>
    </label>
  );
}

export default function EditorLuces({
  riel,
  obra,
  ambiente,
  paredes,
  aplicarRiel,
  aplicarObra,
  aplicarAmbiente,
  aplicarParedes,
  marcar
}: {
  riel: FocoRiel[];
  obra: FocoObra[];
  ambiente: number;
  paredes: number;
  aplicarRiel: (i: number, f: FocoRiel) => void;
  aplicarObra: (i: number, f: FocoObra) => void;
  aplicarAmbiente: (v: number) => void;
  aplicarParedes: (v: number) => void;
  marcar: (grupo: "riel" | "obra", i: number | null) => void;
}) {
  const [r, setR] = useState(riel);
  const [o, setO] = useState(obra);
  const [amb, setAmb] = useState(ambiente);
  const [prd, setPrd] = useState(paredes);
  const [texto, setTexto] = useState("");
  const [copiado, setCopiado] = useState(false);

  const cambiarR = (i: number, campo: keyof FocoRiel, v: number) => {
    const nuevo = r.map((f, k) => (k === i ? { ...f, [campo]: v } : f));
    setR(nuevo);
    aplicarRiel(i, nuevo[i]);
  };

  const cambiarO = (i: number, campo: Exclude<keyof FocoObra, "nombre">, v: number) => {
    const nuevo = o.map((f, k) => (k === i ? { ...f, [campo]: v } : f));
    setO(nuevo);
    aplicarObra(i, nuevo[i]);
  };

  const alCopiar = async () => {
    const codigo = codigoFocos(r, o, amb, prd);
    if (await copiar(codigo, navigator.clipboard)) {
      setCopiado(true);
      setTexto("");
    } else {
      setTexto(codigo);
    }
  };

  return (
    <div
      data-luces
      className="absolute bottom-3 right-3 z-20 max-h-[75%] w-[19rem] overflow-auto rounded-md bg-white/95 p-3 text-[11px] leading-tight text-neutral-900 shadow-lg"
    >
      <p className="mb-1 font-semibold">Luces (solo dev)</p>
      <p className="mb-1 text-neutral-700">Ambiente</p>
      <Campo
        etiqueta="amb."
        valor={amb}
        min={0}
        max={1.5}
        paso={0.05}
        alCambiar={(v) => {
          setAmb(v);
          aplicarAmbiente(v);
        }}
      />
      <p className="mb-1 mt-2 text-neutral-700">Paredes</p>
      <Campo
        etiqueta="opac."
        valor={prd}
        min={0.2}
        max={1}
        paso={0.05}
        alCambiar={(v) => {
          setPrd(v);
          aplicarParedes(v);
        }}
      />
      <p className="mb-2 mt-3 text-neutral-500">Riel del techo</p>
      {r.map((f, i) => (
        <div
          key={"riel" + i}
          className="mb-1"
          onPointerEnter={() => marcar("riel", i)}
          onPointerLeave={() => marcar("riel", null)}
        >
          <p className="text-neutral-700">Riel {i + 1}</p>
          <Campo etiqueta="x" valor={f.x} min={-5} max={0} paso={0.05} alCambiar={(v) => cambiarR(i, "x", v)} />
          <Campo etiqueta="z" valor={f.z} min={-3} max={3} paso={0.05} alCambiar={(v) => cambiarR(i, "z", v)} />
          <Campo etiqueta="alto" valor={f.alto} min={2.8} max={3.6} paso={0.05} alCambiar={(v) => cambiarR(i, "alto", v)} />
          <Campo etiqueta="pot." valor={f.potencia} min={0} max={3} paso={0.05} alCambiar={(v) => cambiarR(i, "potencia", v)} />
          <Campo etiqueta="blend" valor={f.blend} min={0} max={1} paso={0.05} alCambiar={(v) => cambiarR(i, "blend", v)} />
        </div>
      ))}
      <p className="mb-2 mt-3 text-neutral-500">Obras</p>
      {o.map((f, i) => (
        <div
          key={"obra" + i}
          className="mb-1"
          onPointerEnter={() => marcar("obra", i)}
          onPointerLeave={() => marcar("obra", null)}
        >
          <p className="truncate text-neutral-700">{f.nombre}</p>
          <Campo etiqueta="pot." valor={f.potencia} min={0} max={3} paso={0.05} alCambiar={(v) => cambiarO(i, "potencia", v)} />
          <Campo etiqueta="dx" valor={f.dx} min={-1} max={1} paso={0.01} alCambiar={(v) => cambiarO(i, "dx", v)} />
          <Campo etiqueta="dy" valor={f.dy} min={-1} max={1} paso={0.01} alCambiar={(v) => cambiarO(i, "dy", v)} />
          <Campo etiqueta="dz" valor={f.dz} min={-1} max={1} paso={0.01} alCambiar={(v) => cambiarO(i, "dz", v)} />
        </div>
      ))}
      <button type="button" onClick={alCopiar} className="mt-2 rounded bg-neutral-900 px-2 py-1 text-white">
        {copiado ? "Copiado" : "Copiar código"}
      </button>
      {texto && (
        <>
          <p className="mt-2 text-neutral-500">Pegar en src/components/luces.ts</p>
          <textarea
            readOnly
            value={texto}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1 h-24 w-full border p-1 font-mono text-[10px]"
          />
        </>
      )}
    </div>
  );
}
