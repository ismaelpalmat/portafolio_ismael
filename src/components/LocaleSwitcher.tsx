"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/content/tipos";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function cambiar(nuevo: Locale) {
    if (nuevo === locale) {
      return;
    }
    const resto = pathname.replace(/^\/(es|en)(?=\/|$)/, "");
    router.push(`/${nuevo}${resto}`);
  }

  return (
    <div className="interruptor" role="group" aria-label="Idioma / Language">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => cambiar(l)}
          aria-pressed={l === locale}
          disabled={l === locale}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
