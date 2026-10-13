"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { Locale } from "@/content/tipos";

const Viewer3D = dynamic(() => import("./Viewer3D"), { ssr: false });

export default function HomeHero3D({
  locale,
  slug,
  titulo,
  modelo,
  formato
}: {
  locale: Locale;
  slug: string;
  titulo: string;
  modelo?: string;
  formato?: "obj" | "stl";
}) {
  return (
    <Link href={`/${locale}/obra/${slug}`} aria-label={titulo} className="heroe-3d">
      <Viewer3D modelo={modelo ?? ""} formato={formato ?? "obj"} titulo={titulo} />
    </Link>
  );
}
