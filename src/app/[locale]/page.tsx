import { setRequestLocale } from "next-intl/server";
import HomeHero3D from "@/components/HomeHero3D";
import Spotlights from "@/components/Spotlights";
import Pie from "@/components/Pie";
import type { Locale } from "@/content/tipos";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  return (
    <div className="home-viewport">
      <section className="home-oscura">
      <Spotlights />
      <HomeHero3D locale={l} />
      </section>
      <Pie />
    </div>
  );
}
