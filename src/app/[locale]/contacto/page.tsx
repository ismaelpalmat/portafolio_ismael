import { getTranslations, setRequestLocale } from "next-intl/server";
import { CONTACTO } from "@/content/contacto";
import Pie from "@/components/Pie";
import Spotlights from "@/components/Spotlights";
import type { Locale } from "@/content/tipos";

export default async function ContactoPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacto");
  const l = locale as Locale;
  return (
    <>
      <Spotlights />
      <section className="indice">
      <h1 className="indice-titulo">{t("titulo")}</h1>
      <section>
        <h2 className="grupo-titulo">{t("galeria")}</h2>
        <p>
          <strong>{CONTACTO.galeria.nombre}</strong>
        </p>
        <p>{CONTACTO.galeria.direccion[l]}</p>
        <p>
          {t("email")}:{" "}
          <a href={`mailto:${CONTACTO.galeria.email}`}>{CONTACTO.galeria.email}</a>
        </p>
        <p>
          {t("telefono")}:{" "}
          <a href={`tel:${CONTACTO.galeria.telefono.replace(/ /g, "")}`}>
            {CONTACTO.galeria.telefono}
          </a>
        </p>
      </section>
      <section>
        <h2 className="grupo-titulo">{t("estudio")}</h2>
        <p>
          <strong>{CONTACTO.estudio.nombre}</strong>
        </p>
        <p>{CONTACTO.estudio.direccion[l]}</p>
        <p>
          {t("email")}:{" "}
          <a href={`mailto:${CONTACTO.estudio.email}`}>{CONTACTO.estudio.email}</a>
        </p>
      </section>
      </section>
      <Pie />
    </>
  );
}
