import { defineRouting } from "next-intl/routing";

export const locales = ["es", "en"] as const;
export const defaultLocale = "es" as const;
export type { Locale } from "../content/tipos.ts";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always"
});
