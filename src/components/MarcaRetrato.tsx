"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Locale } from "@/content/tipos";

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
        <span
          className="marca-foto"
          aria-hidden="true"
          style={{ left: pos.x + 16, top: pos.y + 16 }}
        />
      )}
    </Link>
  );
}
