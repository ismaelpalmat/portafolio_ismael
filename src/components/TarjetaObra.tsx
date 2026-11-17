import Link from "next/link";
import type { Locale } from "@/content/tipos";
import PlaceholderArt from "./PlaceholderArt";

export default function TarjetaObra({
  locale,
  slug,
  titulo,
  anio,
  miniatura
}: {
  locale: Locale;
  slug: string;
  titulo: string;
  anio: number;
  miniatura?: string;
}) {
  return (
    <Link href={`/${locale}/obra/${slug}`} className="tarjeta tarjeta-hover">
      {miniatura ? (
        // eslint-disable-next-line @next/next/no-img-element -- export estático: sin optimizador de imágenes
        <img src={miniatura} alt={titulo} className="tarjeta-miniatura" />
      ) : (
        <PlaceholderArt etiqueta={slug} titulo={titulo} />
      )}
      <span className="tarjeta-titulo">{titulo}</span>
      <span className="tarjeta-anio">{anio}</span>
    </Link>
  );
}
