import { test } from "node:test";
import assert from "node:assert/strict";
import { RIEL, OBRAS, codigoFocos } from "../src/components/luces.ts";

test("codigo de focos listo para pegar", () => {
  assert.equal(RIEL.length, 9);
  const txt = codigoFocos(RIEL, OBRAS);
  assert.ok(txt.includes("export const RIEL: FocoRiel[] = ["));
  assert.ok(txt.includes("export const OBRAS: FocoObra[] = ["));
  assert.equal(txt.match(/\{ x: /g)?.length, RIEL.length);
  assert.equal(txt.match(/nombre: "/g)?.length, OBRAS.length);
  assert.ok(txt.includes("{ x: -4.2, z: -1.15, alto: 3.45, potencia: 1 }"));
});

test("redondea a dos decimales y conserva los cambios", () => {
  const txt = codigoFocos(
    [{ x: -1.234, z: 2.005, alto: 3.456, potencia: 0.556 }],
    [{ nombre: "Text.003", potencia: 0.234, dx: -0.1, dy: 0.02, dz: 0 }]
  );
  assert.ok(txt.includes("x: -1.23"));
  assert.ok(txt.includes("alto: 3.46"));
  assert.ok(txt.includes("potencia: 0.56"));
  assert.ok(txt.includes('nombre: "Text.003"'));
  assert.ok(txt.includes("dx: -0.1"));
});

test("valores extremos no producen NaN", () => {
  const txt = codigoFocos([{ x: 0, z: 0, alto: 0, potencia: 0 }], []);
  assert.ok(txt.includes("potencia: 0"));
  assert.ok(!txt.includes("NaN"));
});
