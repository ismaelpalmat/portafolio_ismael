import { getTranslations, setRequestLocale } from "next-intl/server";
import PlaceholderArt from "@/components/PlaceholderArt";
import { PRODUCTOS } from "@/content/productos";
import Pie from "@/components/Pie";
import Spotlights from "@/components/Spotlights";
import type { Locale } from "@/content/tipos";

export default async function ShopPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shop");
  const l = locale as Locale;
  return (
    <>
      <Spotlights />
      <section className="indice">
        <h1 className="indice-titulo">{t("titulo")}</h1>
        <div className="shop-panel">
          <div className="shop-grid">
            {PRODUCTOS.map((p) => (
              <article key={p.slug} className="shop-item">
                <PlaceholderArt
                  className="shop-foto"
                  etiqueta={p.slug}
                  titulo={p.nombre[l]}
                />
                <h2 className="shop-nombre">{p.nombre[l]}</h2>
                <p className="shop-monto">{p.monto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Pie />
    </>
  );
}
