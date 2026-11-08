import { getTranslations, setRequestLocale } from "next-intl/server";
import { CONTACTO } from "@/content/contacto";
import Pie from "@/components/Pie";
import Spotlights from "@/components/Spotlights";

export default async function ContactoPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacto");
  return (
    <>
      <Spotlights />
      <section className="indice">
      <h1 className="indice-titulo">{t("titulo")}</h1>
      <div className="contacto-cols">
      <section>
        <h2 className="grupo-titulo">{t("email")}</h2>
        <p>
          <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>
        </p>
      </section>
      <section>
        <h2 className="grupo-titulo">{t("instagram")}</h2>
        <p>
          <a
            href={`https://instagram.com/${CONTACTO.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            @{CONTACTO.instagram}
          </a>
        </p>
      </section>
      </div>
      </section>
      <Pie />
    </>
  );
}
