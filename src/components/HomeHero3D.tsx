"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/content/tipos";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

const MODELOS: Array<{ modelo: string; formato: "obj" | "glb" }> = [
  { modelo: "", formato: "obj" },
  { modelo: "/models/mech_char_2.glb", formato: "glb" }
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
  const [opcion, setOpcion] = useState(0);
  const destino = `/${locale}/obra/${slug}`;
  useEffect(() => {
    let visto = -1;
    try {
      const g = window.localStorage.getItem("vitrina-hero");
      visto = g === "1" ? 1 : 0;
    } catch {
      visto = 0;
    }
    const siguiente = visto === 0 ? 1 : 0;
    setOpcion(siguiente);
    try {
      window.localStorage.setItem("vitrina-hero", String(siguiente));
    } catch {
    }
  }, []);
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
      <Viewer3D modelo={MODELOS[opcion].modelo} formato={MODELOS[opcion].formato} titulo={titulo} distancia={3.1} glitchZoom />
    </div>
  );
}
