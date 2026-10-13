import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/tipos";
import LocaleSwitcher from "./LocaleSwitcher";

export default async function SiteNav({ locale }: { locale: Locale }) {
  const t = await getTranslations("nav");
  const base = `/${locale}`;
  const enlaces = [
    { href: base, etiqueta: t("inicio") },
    { href: `${base}/pinturas`, etiqueta: t("pinturas") },
    { href: `${base}/dibujos`, etiqueta: t("dibujos") },
    { href: `${base}/tresde`, etiqueta: t("tresde") },
    { href: `${base}/biografia`, etiqueta: t("biografia") },
    { href: `${base}/contacto`, etiqueta: t("contacto") }
  ];
  return (
    <header>
      <nav>
        {enlaces.map((e) => (
          <Link key={e.href} href={e.href}>
            {e.etiqueta}
          </Link>
        ))}
        <LocaleSwitcher locale={locale} />
      </nav>
    </header>
  );
}
