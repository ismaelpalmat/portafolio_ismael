import { getTranslations } from "next-intl/server";
import type { Locale } from "@/content/tipos";
import LocaleSwitcher from "./LocaleSwitcher";
import MarcaRetrato from "./MarcaRetrato";
import MenuMovil from "./MenuMovil";

export default async function SiteNav({ locale }: { locale: Locale }) {
  const t = await getTranslations("nav");
  const base = `/${locale}`;
  const enlaces = [
    { href: base, etiqueta: t("inicio") },
    { href: `${base}/pinturas`, etiqueta: t("pinturas") },
    { href: `${base}/dibujos`, etiqueta: t("dibujos") },
    { href: `${base}/tresde`, etiqueta: t("tresde") },
    { href: `${base}/shop`, etiqueta: t("shop") },
    { href: `${base}/biografia`, etiqueta: t("biografia") },
    { href: `${base}/contacto`, etiqueta: t("contacto") }
  ];
  return (
    <header className="menu-blur">
      <nav>
        <MarcaRetrato locale={locale} />
        <MenuMovil enlaces={enlaces} />
        <LocaleSwitcher locale={locale} />
      </nav>
    </header>
  );
}
