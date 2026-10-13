"use client";

import { useEffect } from "react";
import type { Locale } from "@/content/tipos";

export default function LangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
