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
      <span className="tema-a-oscuro">{t("oscuro")}</span>
      <span className="tema-a-claro">{t("claro")}</span>
    </button>
  );
}
