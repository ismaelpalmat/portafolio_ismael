import { getTranslations } from "next-intl/server";
import type { Locale, Obra } from "@/content/tipos";

export default async function FichaDatos({ obra, locale }: { obra: Obra; locale: Locale }) {
  const t = await getTranslations("ficha");
  return (
    <div className="ficha-datos">
      <h1 className="ficha-titulo">{obra.titulo[locale]}</h1>
      <dl className="ficha-lista">
        <div>
          <dt>{t("anio")}</dt>
          <dd>{obra.anio}</dd>
        </div>
        <div>
          <dt>{t("tecnica")}</dt>
          <dd>{obra.tecnica[locale]}</dd>
        </div>
        <div>
          <dt>{t("materiales")}</dt>
          <dd>{obra.materiales[locale]}</dd>
        </div>
        <div>
          <dt>{t("dimensiones")}</dt>
          <dd>{obra.dimensiones}</dd>
        </div>
      </dl>
      <p className="ficha-descripcion">{obra.descripcion[locale]}</p>
    </div>
  );
}
