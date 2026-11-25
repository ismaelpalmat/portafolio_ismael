"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { obraPorSlug } from "@/content/obras";
import type { Locale } from "@/content/tipos";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

const MODELOS: Array<{ slug: string; modelo: string; formato: "obj" | "glb"; distancia: number }> = [
  { slug: "flower-scene", modelo: "/models/Flower_scene.glb", formato: "glb", distancia: 3.5 },
  { slug: "buildings-brutalist-1", modelo: "/models/Buildings_Brutalist_1.glb", formato: "glb", distancia: 4 },
  { slug: "boxer-gold", modelo: "/models/Boxer_gold.glb", formato: "glb", distancia: 4 },
  { slug: "boxer-helmet", modelo: "/models/Boxer_helmet_2.glb", formato: "glb", distancia: 4 },
  { slug: "gallery-map-1", modelo: "/models/Gallery+_map_1.glb", formato: "glb", distancia: 4 }
];

let eleccion: number | null = null;
const elegirAlAzar = () => (eleccion ??= Math.floor(Math.random() * MODELOS.length));
const sinSuscripcion = () => () => {};

export default function HomeHero3D({ locale }: { locale: Locale }) {
  const router = useRouter();
  const origen = useRef<{ x: number; y: number } | null>(null);
  const opcion = useSyncExternalStore(sinSuscripcion, elegirAlAzar, () => 0);
  const destino = `/${locale}/obra/${MODELOS[opcion].slug}`;
  const titulo = obraPorSlug(MODELOS[opcion].slug)?.titulo[locale] ?? "";
  return (
    <>
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
        <Viewer3D modelo={MODELOS[opcion].modelo} formato={MODELOS[opcion].formato} titulo={titulo} distancia={MODELOS[opcion].distancia} velocidad={0.003} phiInicial={0.9} zoomAuto={0.4} focoSuperior reservaProcedural={false} glitchZoom />
      </div>
      <h1 className="home-titulo glitch" data-text={titulo}>{titulo}</h1>
    </>
  );
}
