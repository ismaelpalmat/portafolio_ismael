import { test } from "node:test";
import assert from "node:assert/strict";
import {
  OBRAS_3D,
  OBRAS_PICTORICAS,
  obraDestacada,
  obraPorSlug,
  obrasPorTipo,
  todasLasObras,
  vecinasDelMismoTipo,
} from "../src/content/obras.ts";
import { PERIODOS, esLocalizado } from "../src/content/tipos.ts";

test("al menos 20 pictoricas y 4 3d", () => {
  assert.ok(OBRAS_PICTORICAS.length >= 20);
  assert.ok(OBRAS_3D.length >= 4);
});

test("PERIODOS son los 5 validos", () => {
  assert.deepEqual(PERIODOS, ["2026", "2024–25", "2022–23", "2020–21", "2018–19"]);
});

test("slugs unicos", () => {
  const slugs = todasLasObras().map((o) => o.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("periodo valido en cada obra", () => {
  for (const o of todasLasObras()) {
    assert.ok(PERIODOS.includes(o.periodo), "periodo invalido en " + o.slug);
  }
});

test("titulo, tecnica, materiales y descripcion con es+en no vacios", () => {
  for (const o of todasLasObras()) {
    const campos = [o.titulo, o.tecnica, o.materiales, o.descripcion];
    for (const c of campos) {
      assert.ok(esLocalizado(c), "localizado invalido en " + o.slug);
      assert.ok(c.es.trim().length > 0, "es vacio en " + o.slug);
      assert.ok(c.en.trim().length > 0, "en vacio en " + o.slug);
    }
  }
});

test("exactamente 1 destacada y obraDestacada la devuelve", () => {
  assert.equal(
    todasLasObras().filter((o) => o.destacada).length,
    1,
  );
  assert.equal(obraDestacada().destacada, true);
});

test("cada 3d con modelo en public/models y formato obj|stl", () => {
  for (const o of OBRAS_3D) {
    assert.ok(o.modelo.startsWith("/models/"), "modelo fuera de /models/ en " + o.slug);
    assert.ok(o.formato === "obj" || o.formato === "stl", "formato invalido en " + o.slug);
    assert.ok(o.modelo.endsWith("." + o.formato), "extension no coincide en " + o.slug);
  }
});

test("helpers por tipo, slug y vecinas", () => {
  assert.ok(obrasPorTipo("pintura").length + obrasPorTipo("dibujo").length >= 20);
  assert.ok(obrasPorTipo("3d").length >= 4);
  const primera = obrasPorTipo("pintura")[0];
  assert.equal(obraPorSlug(primera.slug)?.slug, primera.slug);
  assert.equal(obraPorSlug("no-existe"), undefined);
  const vecinas = vecinasDelMismoTipo(primera.slug);
  assert.equal(vecinas.anterior, null);
  assert.equal(vecinas.siguiente?.tipo, "pintura");
});
