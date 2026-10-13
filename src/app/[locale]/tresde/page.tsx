import { getTranslations, setRequestLocale } from "next-intl/server";
import GrupoPorPeriodo from "@/components/GrupoPorPeriodo";
import { obrasPorTipo } from "@/content/obras";
import type { Locale } from "@/content/tipos";

export default async function TresdePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("indices");
  return (
    <section className="indice">
      <h1 className="indice-titulo">{t("tresde")}</h1>
      <GrupoPorPeriodo locale={locale as Locale} obras={obrasPorTipo("3d")} />
    </section>
  );
}
