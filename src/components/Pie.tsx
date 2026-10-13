import { getTranslations } from "next-intl/server";

export default async function Pie() {
  const t = await getTranslations("footer");
  const anio = new Date().getFullYear();
  return (
    <footer className="pie">
      <p>© {anio} Ismael Palma Téllez · {t("derechos")}</p>
    </footer>
  );
}
