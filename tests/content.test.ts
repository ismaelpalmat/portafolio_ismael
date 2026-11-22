import { test } from "node:test";
import assert from "node:assert/strict";
import {
  obraPorSlug,
  obrasPorTipo,
  vecinasDelMismoTipo,
} from "../src/content/obras.ts";

test("helpers por tipo, slug y vecinas", () => {
  assert.ok(obrasPorTipo("pintura").length + obrasPorTipo("dibujo").length >= 20);
  assert.equal(obrasPorTipo("3d").length, 6);
  const primera = obrasPorTipo("pintura")[0];
  assert.equal(obraPorSlug(primera.slug)?.slug, primera.slug);
  assert.equal(obraPorSlug("no-existe"), undefined);
  const vecinas = vecinasDelMismoTipo(primera.slug);
  assert.equal(vecinas.anterior, null);
  assert.equal(vecinas.siguiente?.tipo, "pintura");
});
