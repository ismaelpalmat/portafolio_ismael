"use client";

import { useTranslations } from "next-intl";

export default function TemaToggle() {
  const t = useTranslations("tema");
  return (
    <button
      type="button"
      className="tema"
      aria-label={t("cambiar")}
      onClick={() => {
        const raiz = document.documentElement;
        const siguiente = raiz.dataset.tema === "oscuro" ? "claro" : "oscuro";
        raiz.dataset.tema = siguiente;
        try {
          window.localStorage.setItem("vitrina-tema", siguiente);
        } catch {
          // sin almacenamiento: el tema dura la sesión
        }
      }}
    >
      <svg
        className="tema-icono tema-icono-luna"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg
        className="tema-icono tema-icono-sol"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
