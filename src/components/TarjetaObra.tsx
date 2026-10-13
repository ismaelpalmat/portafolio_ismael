import Link from "next/link";
import type { Locale } from "@/content/tipos";
import PlaceholderArt from "./PlaceholderArt";

export default function TarjetaObra({
  locale,
  slug,
  titulo,
  anio
}: {
  locale: Locale;
  slug: string;
  titulo: string;
  anio: number;
}) {
  return (
    <Link href={`/${locale}/obra/${slug}`} className="tarjeta">
      <PlaceholderArt etiqueta={slug} titulo={titulo} />
      <span className="tarjeta-titulo">{titulo}</span>
      <span className="tarjeta-anio">{anio}</span>
    </Link>
  );
}
