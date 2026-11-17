import { defineRouting } from "next-intl/routing";
import { LOCALES } from "../content/tipos.ts";

export const defaultLocale = "es" as const;
export type { Locale } from "../content/tipos.ts";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale,
  localePrefix: "always"
});
