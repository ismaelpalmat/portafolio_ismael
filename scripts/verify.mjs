import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function rootHtmlLeftovers() {
  const errores = [];
  for (const f of readdirSync(ROOT)) {
    if (f.toLowerCase().endsWith(".html")) {
      errores.push("HTML viejo sin borrar: " + f);
    }
  }
  return errores;
}

function walk(dir, out) {
  const acc = out || [];
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".next") {
      continue;
    }
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p, acc);
    } else {
      acc.push(p);
    }
  }
  return acc;
}

function scanSrc(regex, etiqueta) {
  const src = join(ROOT, "src");
  if (!existsSync(src)) {
    return ["falta src/"];
  }
  const errores = [];
  for (const f of walk(src)) {
    if (!f.endsWith(".ts") && !f.endsWith(".tsx") && !f.endsWith(".json")) {
      continue;
    }
    const txt = readFileSync(f, "utf8");
    if (regex.test(txt)) {
      errores.push(etiqueta + " en " + f);
    }
  }
  return errores;
}

async function contenido() {
  const errores = [];
  let mod;
  let tipos;
  try {
    mod = await import("../src/content/obras.ts");
    tipos = await import("../src/content/tipos.ts");
  } catch (e) {
    return ["no se pudo importar src/content/obras.ts: " + String(e).split("\n")[0]];
  }
  const pictoricas = mod.OBRAS_PICTORICAS || [];
  const tresde = mod.OBRAS_3D || [];
  const periodos = (tipos && tipos.PERIODOS) || mod.PERIODOS || [];
  if (pictoricas.length !== 20) {
    errores.push("pictoricas=" + pictoricas.length + " (esperado 20)");
  }
  if (tresde.length !== 4) {
    errores.push("3d=" + tresde.length + " (esperado 4)");
  }
  const validos = ["2026", "2024–25", "2022–23", "2020–21", "2018–19"];
  if (JSON.stringify(periodos) !== JSON.stringify(validos)) {
    errores.push("PERIODOS invalidos: " + JSON.stringify(periodos));
  }
  const todas = pictoricas.concat(tresde);
  const slugs = todas.map((o) => o.slug);
  if (new Set(slugs).size !== slugs.length) {
    errores.push("slugs duplicados");
  }
  for (const o of todas) {
    if (!validos.includes(o.periodo)) {
      errores.push("periodo invalido en " + o.slug);
    }
    for (const campo of ["titulo", "tecnica", "materiales", "descripcion"]) {
      const v = o[campo];
      if (!v || typeof v.es !== "string" || v.es.trim() === "" || typeof v.en !== "string" || v.en.trim() === "") {
        errores.push("simetria es/en rota en " + o.slug + "." + campo);
      }
    }
  }
  if (todas.filter((o) => o.destacada).length !== 1) {
    errores.push("destacada debe ser exactamente 1");
  }
  for (const o of tresde) {
    if (typeof o.modelo !== "string" || !o.modelo.startsWith("/models/")) {
      errores.push("modelo fuera de /models/ en " + o.slug);
    }
    if (o.formato !== "obj" && o.formato !== "stl") {
      errores.push("formato invalido en " + o.slug);
    } else if (!o.modelo.endsWith("." + o.formato)) {
      errores.push("extension no coincide en " + o.slug);
    }
  }
  return errores;
}

function llaves(obj, pref) {
  const acc = pref || [];
  let out = [];
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v !== null && typeof v === "object") {
      out = out.concat(llaves(v, acc.concat(k)));
    } else {
      out.push(acc.concat(k).join("."));
    }
  }
  return out;
}

function diccionarios() {
  const base = join(ROOT, "src", "i18n", "messages");
  let es;
  let en;
  try {
    es = JSON.parse(readFileSync(join(base, "es.json"), "utf8"));
    en = JSON.parse(readFileSync(join(base, "en.json"), "utf8"));
  } catch (e) {
    return ["no se pudieron leer diccionarios"];
  }
  const kes = llaves(es).sort();
  const ken = llaves(en).sort();
  if (JSON.stringify(kes) !== JSON.stringify(ken)) {
    return ["claves es/en distintas"];
  }
  return [];
}

function rutaTresde() {
  const errores = [];
  const src = join(ROOT, "src");
  if (!existsSync(src)) {
    return ["falta src/"];
  }
  for (const f of walk(src)) {
    if (!f.endsWith(".ts") && !f.endsWith(".tsx")) {
      continue;
    }
    const txt = readFileSync(f, "utf8");
    if (/\/3d["'/]/.test(txt)) {
      errores.push("ruta /3d prohibida (usar /tresde) en " + f);
    }
  }
  return errores;
}

async function homeTresD() {
  const pagina = join(ROOT, "src", "app", "[locale]", "page.tsx");
  if (!existsSync(pagina)) {
    return ["falta home src/app/[locale]/page.tsx"];
  }
  const txt = readFileSync(pagina, "utf8");
  let slug = "";
  try {
    const mod = await import("../src/content/obras.ts");
    slug = mod.obraDestacada().slug;
  } catch (e) {
    return ["no se pudo leer obra destacada"];
  }
  const errores = [];
  if (!txt.includes("obraDestacada") || !txt.includes("/obra/")) {
    errores.push("home no enlaza a la destacada obra/" + slug);
  }
  const hero = join(ROOT, "src", "components", "HomeHero3D.tsx");
  const viewer = join(ROOT, "src", "components", "Viewer3D.tsx");
  if (!existsSync(hero) || !existsSync(viewer)) {
    errores.push("falta HomeHero3D o Viewer3D");
  } else {
    const h = readFileSync(hero, "utf8");
    const w = readFileSync(viewer, "utf8");
    const dynamics = (h.match(/ssr:\s*false/g) || []).length;
    const canvas = (w.match(/<canvas/g) || []).length;
    if (dynamics !== 1) {
      errores.push("home debe tener exactamente 1 dynamic ssr:false");
    }
    if (canvas > 1) {
      errores.push("Viewer3D con mas de 1 canvas");
    }
    if (!w.includes("SpotLight")) {
      errores.push("Viewer3D sin SpotLight");
    }
    if (!w.includes("use client")) {
      errores.push("Viewer3D debe ser client");
    }
  }
  const cfg = readFileSync(join(ROOT, "next.config.mjs"), "utf8");
  if (/output\\s*:\\s*["ecto]export["ecto]/.test(cfg)) {
    errores.push("next.config con output:export prohibido");
  }
  return errores;
}

export async function verify() {
  const errores = rootHtmlLeftovers()
    .concat(scanSrc(/media|textos/i, "referencia a media/textos"))
    .concat(
      scanSrc(
        /precio|comprar|tienda|carrito|checkout|pago|price|buy|shop|cart|payment/i,
        "palabra comercial",
      ),
    )
    .concat(await contenido())
    .concat(diccionarios())
    .concat(rutaTresde())
    .concat(await homeTresD());
  return { ok: errores.length === 0, errores };
}

const resultado = await verify();
for (const e of resultado.errores) {
  console.error("VERIFY FAIL: " + e);
}
console.log(resultado.ok ? "VERIFY OK" : "VERIFY FAIL");
process.exit(resultado.ok ? 0 : 1);
