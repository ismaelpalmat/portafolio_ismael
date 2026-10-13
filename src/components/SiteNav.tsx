import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/tipos";
import LocaleSwitcher from "./LocaleSwitcher";
import MarcaRetrato from "./MarcaRetrato";

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
    <header className="menu-blur">
      <nav>
        <MarcaRetrato locale={locale} />
        <div className="nav-enlaces">
          {enlaces.map((e) => (
          <Link key={e.href} href={e.href}>
            {e.etiqueta}
          </Link>
        ))}
        </div>
        <LocaleSwitcher locale={locale} />
      </nav>
    </header>
  );
}
