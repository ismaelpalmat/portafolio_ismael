import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const es = JSON.parse(readFileSync(join(ROOT, "src/i18n/messages/es.json"), "utf8")) as Record<
  string,
  unknown
>;
const en = JSON.parse(readFileSync(join(ROOT, "src/i18n/messages/en.json"), "utf8")) as Record<
  string,
  unknown
>;

function claves(obj: Record<string, unknown>, pref: string[] = []): string[] {
  let out: string[] = [];
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v !== null && typeof v === "object") {
      out = out.concat(claves(v as Record<string, unknown>, pref.concat(k)));
    } else {
      out.push(pref.concat(k).join("."));
    }
  }
  return out;
}

function valor(obj: Record<string, unknown>, ruta: string): unknown {
  return ruta.split(".").reduce<unknown>((a, k) => (a as Record<string, unknown>)[k], obj);
}

const PROHIBIDAS = /media|textos|precio|comprar|tienda|carrito|checkout|pago|price|buy|shop|cart|payment/i;

test("paridad exacta de claves es/en", () => {
  assert.deepEqual(claves(es).sort(), claves(en).sort());
});

test("ningun valor vacio", () => {
  for (const ruta of claves(es)) {
    const ves = valor(es, ruta);
    const ven = valor(en, ruta);
    assert.ok(typeof ves === "string" && ves.trim() !== "", "vacio es." + ruta);
    assert.ok(typeof ven === "string" && ven.trim() !== "", "vacio en." + ruta);
  }
});

test("sin palabras prohibidas en diccionarios", () => {
  for (const ruta of claves(es)) {
    const ves = valor(es, ruta);
    const ven = valor(en, ruta);
    assert.ok(typeof ves === "string" && !PROHIBIDAS.test(ves), "prohibida es." + ruta);
    assert.ok(typeof ven === "string" && !PROHIBIDAS.test(ven), "prohibida en." + ruta);
  }
});

test("claves bio y contacto completas y simetricas", () => {
  const espero = [
    "bio.titulo",
    "bio.resumen",
    "bio.individuales",
    "bio.colectivas",
    "bio.reconocimientos",
    "contacto.titulo",
    "contacto.galeria",
    "contacto.estudio",
    "contacto.email",
    "contacto.direccion",
    "contacto.telefono"
  ];
  const hay = claves(es);
  for (const k of espero) {
    assert.ok(hay.includes(k), "falta clave " + k);
    assert.ok(typeof valor(en, k) === "string" && (valor(en, k) as string).trim() !== "", "en vacio " + k);
  }
});

test("contacto sin formulario", () => {
  const c = readFileSync(join(ROOT, "src/content/contacto.ts"), "utf8");
  const p = readFileSync(join(ROOT, "src/app/[locale]/contacto/page.tsx"), "utf8");
  for (const s of ["<form", "submit", "<input", "<textarea"]) {
    assert.ok(!c.includes(s), "formulario en contacto.ts: " + s);
    assert.ok(!p.includes(s), "formulario en contacto page: " + s);
  }
});
