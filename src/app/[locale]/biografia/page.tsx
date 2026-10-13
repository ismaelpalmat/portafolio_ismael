import { getTranslations, setRequestLocale } from "next-intl/server";
import { BIOGRAFIA } from "@/content/biografia";
import Pie from "@/components/Pie";
import type { Locale } from "@/content/tipos";

export default async function BiografiaPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bio");
  const l = locale as Locale;
  const grupos = [
    { titulo: t("individuales"), items: BIOGRAFIA.individuales },
    { titulo: t("colectivas"), items: BIOGRAFIA.colectivas },
    { titulo: t("reconocimientos"), items: BIOGRAFIA.reconocimientos }
  ];
  return (
    <>
      <section className="indice">
      <h1 className="indice-titulo">{t("titulo")}</h1>
      <p>
        <strong>{BIOGRAFIA.nombre}</strong>
      </p>
      <h2 className="grupo-titulo">{t("resumen")}</h2>
      <p>{BIOGRAFIA.resumen[l]}</p>
      {grupos.map((g) => (
        <section key={g.titulo}>
          <h2 className="grupo-titulo">{g.titulo}</h2>
          <ul>
            {g.items.map((item) => (
              <li key={item[l]}>{item[l]}</li>
            ))}
          </ul>
        </section>
      ))}
      </section>
      <Pie />
    </>
  );
}
