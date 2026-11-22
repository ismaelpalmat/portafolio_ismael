"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/content/tipos";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

const MODELOS: Array<{ slug: string; modelo: string; formato: "obj" | "glb"; distancia: number }> = [
  { slug: "flower-scene", modelo: "/models/Flower_scene.glb", formato: "glb", distancia: 3.5 },
  { slug: "buildings-brutalist-1", modelo: "/models/Buildings_Brutalist_1.glb", formato: "glb", distancia: 4 }
];

export default function HomeHero3D({
  locale,
  titulo
}: {
  locale: Locale;
  titulo: string;
}) {
  const router = useRouter();
  const origen = useRef<{ x: number; y: number } | null>(null);
  const [opcion] = useState(() => Math.floor(Math.random() * MODELOS.length));
  const destino = `/${locale}/obra/${MODELOS[opcion].slug}`;
  return (
    <div
      className="heroe-3d"
      role="link"
      tabIndex={0}
      aria-label={titulo}
      onPointerDown={(e) => {
        origen.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        const o = origen.current;
        origen.current = null;
        if (!o) {
          return;
        }
        const dx = e.clientX - o.x;
        const dy = e.clientY - o.y;
        if (dx * dx + dy * dy < 25) {
          router.push(destino);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(destino);
        }
      }}
    >
      <Viewer3D modelo={MODELOS[opcion].modelo} formato={MODELOS[opcion].formato} titulo={titulo} distancia={MODELOS[opcion].distancia} velocidad={0.003} phiInicial={0.9} zoomAuto={0.4} focoSuperior glitchZoom />
    </div>
  );
}
