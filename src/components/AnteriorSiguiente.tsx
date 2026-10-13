import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale, Obra } from "@/content/tipos";

export default async function AnteriorSiguiente({
  locale,
  anterior,
  siguiente
}: {
  locale: Locale;
  anterior: Obra | null;
  siguiente: Obra | null;
}) {
  const t = await getTranslations("ficha");
  return (
    <nav className="anterior-siguiente" aria-label="Otras obras">
      {anterior ? (
        <Link href={`/${locale}/obra/${anterior.slug}`}>
          {t("anterior")}: {anterior.titulo[locale]}
        </Link>
      ) : (
        <span />
      )}
      {siguiente ? (
        <Link href={`/${locale}/obra/${siguiente.slug}`}>
          {t("siguiente")}: {siguiente.titulo[locale]}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
