import type { LocalizedText } from "./tipos.ts";

export interface Contacto {
  galeria: {
    nombre: string;
    direccion: LocalizedText;
    email: string;
    telefono: string;
  };
  estudio: {
    nombre: string;
    direccion: LocalizedText;
    email: string;
  };
}

export const CONTACTO: Contacto = {
  galeria: {
    nombre: "Galería Norte",
    direccion: {
      es: "Calle del Río 123, Ciudad",
      en: "123 River Street, City"
    },
    email: "hola@galerianorte.ejemplo",
    telefono: "+34 600 000 000"
  },
  estudio: {
    nombre: "Estudio Palma",
    direccion: {
      es: "Calle del Estudio 45, Ciudad",
      en: "45 Studio Street, City"
    },
    email: "estudio@ismaelpalma.ejemplo"
  }
};
