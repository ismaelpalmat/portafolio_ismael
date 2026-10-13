import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import AnteriorSiguiente from "@/components/AnteriorSiguiente";
import Carrusel from "@/components/Carrusel";
import FichaDatos from "@/components/FichaDatos";
import FichaTresD from "@/components/FichaTresD";
import { obraPorSlug, todasLasObras, vecinasDelMismoTipo } from "@/content/obras";
import Pie from "@/components/Pie";
import type { Locale } from "@/content/tipos";

export function generateStaticParams() {
  const locales = ["es", "en"];
  const out = [];
  for (const locale of locales) {
    for (const o of todasLasObras()) {
      out.push({ locale, slug: o.slug });
    }
  }
  return out;
}

export default async function ObraPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const obra = obraPorSlug(slug);
  if (!obra) {
    notFound();
  }
  const l = locale as Locale;
  const { anterior, siguiente } = vecinasDelMismoTipo(slug);
  return (
    <>
      <section className="ficha">
      {obra.tipo === "3d" ? (
        <FichaTresD modelo={obra.modelo} formato={obra.formato} titulo={obra.titulo[l]} />
      ) : (
        <Carrusel
          titulo={obra.titulo[l]}
          imagenes={Array.from({ length: obra.imagenes }, (_, i) => ({
            etiqueta: `${obra.slug} vista ${i + 1}`
          }))}
        />
      )}
      <FichaDatos obra={obra} locale={l} />
      <AnteriorSiguiente locale={l} anterior={anterior} siguiente={siguiente} />
      </section>
      <Pie />
    </>
  );
}
