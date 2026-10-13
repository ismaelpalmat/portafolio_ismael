import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/content/tipos";
import SiteNav from "@/components/SiteNav";
import LangSync from "@/components/LangSync";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <LangSync locale={locale as Locale} />
      <SiteNav locale={locale as Locale} />
      <main className="aire-menu-imagen">{children}</main>
      <footer>
        <p>Ismael Palma Téllez</p>
      </footer>
    </NextIntlClientProvider>
  );
}
