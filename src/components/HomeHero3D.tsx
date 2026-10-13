"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/content/tipos";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

export default function HomeHero3D({
  locale,
  slug,
  titulo,
  modelo,
  formato
}: {
  locale: Locale;
  slug: string;
  titulo: string;
  modelo?: string;
  formato?: "obj" | "stl";
}) {
  const router = useRouter();
  const origen = useRef<{ x: number; y: number } | null>(null);
  const destino = `/${locale}/obra/${slug}`;
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
      <Viewer3D modelo={modelo ?? ""} formato={formato ?? "obj"} titulo={titulo} />
    </div>
  );
}
