import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HomeHero3D from "@/components/HomeHero3D";
import Spotlights from "@/components/Spotlights";
import { obraDestacada } from "@/content/obras";
import type { Locale } from "@/content/tipos";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const obra = obraDestacada();
  const l = locale as Locale;
  return (
    <section className="home-oscura">
      <p className="home-sub">{t("subtitulo")}</p>
      <Spotlights />
      <HomeHero3D locale={l} slug={obra.slug} titulo={obra.titulo[l]} />
      <h1 className="home-titulo">{obra.titulo[l]}</h1>
      <Link href={`/${locale}/obra/${obra.slug}`} className="home-cta">
        {t("cta")}
      </Link>
    </section>
  );
}
