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

function bannedInSrc() {
  const src = join(ROOT, "src");
  if (!existsSync(src)) {
    return ["falta src/"];
  }
  const errores = [];
  for (const f of walk(src)) {
    const txt = readFileSync(f, "utf8");
    if (/media|textos/i.test(txt)) {
      errores.push("referencia a media/textos en " + f);
    }
  }
  return errores;
}

export async function verify() {
  const errores = rootHtmlLeftovers().concat(bannedInSrc());
  return { ok: errores.length === 0, errores };
}

const resultado = await verify();
for (const e of resultado.errores) {
  console.error("VERIFY FAIL: " + e);
}
console.log(resultado.ok ? "VERIFY OK" : "VERIFY FAIL");
process.exit(resultado.ok ? 0 : 1);
