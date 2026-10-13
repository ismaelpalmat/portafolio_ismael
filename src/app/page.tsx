import { redirect } from "next/navigation";

// GitHub Pages no negocia idioma en servidor: la raíz redirige al default.
export default function RootPage() {
  redirect("/es");
}
