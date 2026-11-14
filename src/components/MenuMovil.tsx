"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function MenuMovil({
  enlaces
}: {
  enlaces: { href: string; etiqueta: string }[];
}) {
  const t = useTranslations("nav");
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <>
      <button
        type="button"
        className="menu-boton"
        aria-label={t("menu")}
        aria-expanded={abierto}
        aria-controls="menu-principal"
        onClick={() => setAbierto((v) => !v)}
      >
        <span className="menu-lineas" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <div
        id="menu-principal"
        className={abierto ? "nav-enlaces abierto" : "nav-enlaces"}
      >
        {enlaces.map((e) => (
          <Link key={e.href} href={e.href} onClick={() => setAbierto(false)}>
            {e.etiqueta}
          </Link>
        ))}
      </div>
    </>
  );
}
