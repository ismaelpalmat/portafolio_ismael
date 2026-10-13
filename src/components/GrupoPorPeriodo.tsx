import { PERIODOS } from "@/content/tipos";
import type { Locale, Obra } from "@/content/tipos";
import TarjetaObra from "./TarjetaObra";

export default function GrupoPorPeriodo({ locale, obras }: { locale: Locale; obras: Obra[] }) {
  return (
    <div className="grupos">
      {PERIODOS.map((periodo) => {
        const delPeriodo = obras.filter((o) => o.periodo === periodo);
        if (delPeriodo.length === 0) {
          return null;
        }
        return (
          <section key={periodo} className="grupo">
            <h2 className="grupo-titulo">{periodo}</h2>
            <div className="tarjetas">
              {delPeriodo.map((o) => (
                <TarjetaObra
                  key={o.slug}
                  locale={locale}
                  slug={o.slug}
                  titulo={o.titulo[locale]}
                  anio={o.anio}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
