import { test } from "node:test";
import assert from "node:assert/strict";
import { RIEL, OBRAS, AMBIENTE, codigoFocos, copiar, obrasEditor } from "../src/components/luces.ts";

function leerLista(txt: string, nombre: string): Record<string, number | string>[] {
  const m = txt.match(new RegExp(`export const ${nombre}: [A-Za-z]+\\[\\] = \\[([\\s\\S]*?)\\n\\];`));
  assert.ok(m, "sin bloque " + nombre);
  return JSON.parse("[" + m[1].replace(/(\w+):/g, '"$1":') + "]") as Record<string, number | string>[];
}

test("codigo de focos listo para pegar", () => {
  assert.equal(RIEL.length, 13);
  const txt = codigoFocos(RIEL, OBRAS, AMBIENTE);
  assert.ok(txt.includes("export const AMBIENTE = 0.3;"));
  assert.ok(txt.includes("export const RIEL: FocoRiel[] = ["));
  assert.ok(txt.includes("export const OBRAS: FocoObra[] = ["));
  assert.equal(txt.match(/\{ x: /g)?.length, RIEL.length);
  assert.equal(txt.match(/nombre: "/g)?.length, OBRAS.length);
});

test("redondea a dos decimales y conserva los cambios", () => {
  const txt = codigoFocos(
    [{ x: -1.234, z: 2.005, alto: 3.456, potencia: 0.556 }],
    [{ nombre: "Text.003", potencia: 0.234, dx: -0.1, dy: 0.02, dz: 0 }],
    0.456
  );
  assert.ok(txt.includes("export const AMBIENTE = 0.46;"));
  assert.ok(txt.includes("x: -1.23"));
  assert.ok(txt.includes("alto: 3.46"));
  assert.ok(txt.includes("potencia: 0.56"));
  assert.ok(txt.includes('nombre: "Text.003"'));
  assert.ok(txt.includes("dx: -0.1"));
});

test("valores extremos no producen NaN", () => {
  const txt = codigoFocos([{ x: 0, z: 0, alto: 0, potencia: 0 }], [], 0);
  assert.ok(txt.includes("potencia: 0"));
  assert.ok(txt.includes("export const AMBIENTE = 0;"));
  assert.ok(!txt.includes("NaN"));
});

test("el codigo generado se puede pegar y parsear", () => {
  const txt = codigoFocos(RIEL, OBRAS, AMBIENTE);
  assert.deepEqual(leerLista(txt, "RIEL"), RIEL);
  assert.deepEqual(leerLista(txt, "OBRAS"), OBRAS);
});

test("el editor conserva la plantilla aunque mirar no exista", () => {
  const { obras, objetivos } = obrasEditor("NoExiste");
  assert.equal(obras.length, OBRAS.length);
  assert.equal(obras[0].nombre, "Plane.004");
  assert.equal(objetivos[0], "NoExiste");
  assert.deepEqual(objetivos.slice(1), OBRAS.slice(1).map((f) => f.nombre));
});

test("copiar avisa cuando no hay portapapeles", async () => {
  assert.equal(await copiar("x", undefined), false);
  assert.equal(await copiar("x", { writeText: async () => {} }), true);
  assert.equal(
    await copiar("x", {
      writeText: () => {
        throw new Error("bloqueado");
      }
    }),
    false
  );
});
