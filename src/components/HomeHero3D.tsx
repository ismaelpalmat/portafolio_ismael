"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/content/tipos";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

const MODELOS: Array<{ modelo: string; formato: "obj" | "glb"; distancia: number }> = [
  { modelo: "", formato: "obj", distancia: 3.1 },
  { modelo: "/models/mech_char_2.glb", formato: "glb", distancia: 2.4 },
  { modelo: "/models/mech_char_pose1.glb", formato: "glb", distancia: 2.4 }
];

export default function HomeHero3D({
  locale,
  slug,
  titulo
}: {
  locale: Locale;
  slug: string;
  titulo: string;
}) {
  const router = useRouter();
  const origen = useRef<{ x: number; y: number } | null>(null);
  const [opcion] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    try {
      const g = Number(window.localStorage.getItem("vitrina-hero"));
      const visto = Number.isInteger(g) ? g : -1;
      return (visto + 1) % MODELOS.length;
    } catch {
      return 0;
    }
  });
  const destino = `/${locale}/obra/${slug}`;
  useEffect(() => {
    try {
      window.localStorage.setItem("vitrina-hero", String(opcion));
    } catch {
      // sin almacenamiento: se queda en procedural
    }
  }, [opcion]);
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
      <Viewer3D modelo={MODELOS[opcion].modelo} formato={MODELOS[opcion].formato} titulo={titulo} distancia={MODELOS[opcion].distancia} glitchZoom />
    </div>
  );
}
