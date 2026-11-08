"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Locale } from "@/content/tipos";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

export default function MarcaRetrato({ locale }: { locale: Locale }) {
  const caja = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <Link
      ref={caja}
      href={`/${locale}`}
      className="marca"
      onMouseMove={(e) => {
        const r = caja.current?.getBoundingClientRect();
        if (!r) {
          return;
        }
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPos(null)}
    >
      Ismael Palma Téllez
      {pos && (
        <div
          className="marca-foto"
          aria-hidden="true"
          style={{ left: pos.x + 16, top: pos.y + 16 }}
        >
          <Viewer3D
            modelo="/models/head_1.glb"
            formato="glb"
            titulo=""
            distancia={3.4}
            cuadrado
          />
        </div>
      )}
    </Link>
  );
}
