import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const titulo = Space_Grotesk({ subsets: ["latin"], variable: "--font-titulo" });
const cuerpo = Inter({ subsets: ["latin"], variable: "--font-cuerpo" });

export const metadata: Metadata = { title: "Portafolio" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      data-tema="claro"
      suppressHydrationWarning
      className={`${titulo.variable} ${cuerpo.variable}`}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("vitrina-tema");if(t==="claro"||t==="oscuro")document.documentElement.dataset.tema=t}catch(e){}'
          }}
        />
        {children}
      </body>
    </html>
  );
}
