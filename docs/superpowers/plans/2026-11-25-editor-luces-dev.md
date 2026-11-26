# Editor de luces 3D (solo desarrollo) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poder mover y ajustar en vivo los 9 focos del riel y las 4 luces de obra del recorrido de `Gallery+_map_1`, y copiar el resultado listo para pegar en el repo.

**Architecture:** Los focos pasan de estar sueltos en el loop de `Viewer3D` a una lista en `src/components/luces.ts`. `Viewer3D` crea las luces desde esa lista y guarda las referencias; con `?luces` en desarrollo monta un panel que edita los valores y aplica los cambios directo a las luces de three. Un botón genera el código con `codigoFocos` para pegar en la lista.

**Tech Stack:** Next 16.4 (client components, export estático), React 19, three 0.186, TypeScript, Tailwind v4, `node --test`.

**Spec:** sin archivo aparte. Diseño acordado en la conversación del 2026-11-25 (resumido abajo).

## Diseño acordado

- Panel oculto: se abre con `?luces` y solo con `process.env.NODE_ENV === "development"`. En el sitio publicado no aparece nunca.
- Una fila por luz: riel (x, z, alto, potencia) y obra (potencia y desplazamiento dx, dy, dz desde el centro del nodo).
- Al pasar el puntero por una fila, una esferita marca esa luz en la escena.
- Botón "Copiar código": arma las dos listas con los valores actuales. Si el portapapeles falla, muestra el texto para copiar a mano.
- El repo sigue siendo la fuente de verdad: el panel no guarda nada.
- Textos del panel en español y sin i18n: es herramienta interna, nunca se publica.

## Global Constraints

- Sin dependencias nuevas.
- Panel inalcanzable en producción: la condición es `process.env.NODE_ENV === "development"`. Puede quedar como código muerto en el bundle; nunca se muestra.
- PowerShell 5.1: usar `npm.cmd` (nunca `npm`).
- Archivos nuevos UTF-8 sin BOM, saltos LF.
- `scripts/verify.mjs` bloquea en `src/` las palabras `precio|comprar|tienda|carrito|checkout|pago|price|buy|cart|payment` y `media|textos`. Ojo: "cartel", "descarta" e "inmediato" contienen esas cadenas; usar "rótulo" y evitar las otras.
- Coordenadas del riel en espacio del GLB (`x`, `z`), altura en metros del modelo (`alto`). `Viewer3D` las lleva a mundo con `localToWorld`.
- La única lógica con test es `codigoFocos`; el resto se comprueba en el navegador.

## Review Focus

1. Clic, rueda o arrastre sobre el panel también llegan a los listeners nativos del visor (encuadrar una obra, zoom, girar). Se evita con la guarda `data-luces` en cada listener; se comprueba a mano en la tarea 3.
2. Producción: el panel no debe abrirse con `?luces` en el export. Se comprueba en la tarea 4.
3. Nodo del GLB ausente (por ejemplo `mirar` mal escrito): su fila no aparece y no desalinea las demás luces. Se comprueba a mano en la tarea 3.
4. Valores extremos de los sliders (potencia 0, x fuera de la sala): la escena sigue funcionando y el código copiado no lleva `NaN`. Los `input range` limitan el rango y `codigoFocos` redondea.
5. Portapapeles bloqueado: aparece el texto para copiar a mano. Se comprueba a mano en la tarea 3.

---

### Task 1: Lista de luces y formateador

**Files:**
- Create: `src/components/luces.ts`
- Test: `tests/focos.test.ts`

**Interfaces:**
- Produces: `FocoRiel = { x: number; z: number; alto: number; potencia: number }`, `FocoObra = { nombre: string; potencia: number; dx: number; dy: number; dz: number }`, `RIEL: FocoRiel[]` (9), `OBRAS: FocoObra[]` (4), `codigoFocos(riel: FocoRiel[], obra: FocoObra[]): string`.

- [ ] **Step 1: Escribir el test que falla**

```ts
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
    [{ x: -1.234, z: 2.005, alto: 3.456, potencia: 0.555 }],
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
```

- [ ] **Step 2: Correr el test y ver que falla**

Run: `node --test tests/focos.test.ts`
Expected: FAIL, no encuentra `../src/components/luces.ts`.

- [ ] **Step 3: Crear `src/components/luces.ts`**

Contenido exacto de las listas: 5 focos en `z: -1.15` con `x` −4.2, −3.65, −3.1, −2.55, −2.0; 4 focos en `x: -1.9` con `z` −0.8, −0.2, 0.4, 1.0. Todos `alto: 3.45, potencia: 1`. `OBRAS`: `Plane.004` potencia 0.5, `Text.003` potencia 0.2, `dibujo mañio` y `paisaje_hztl_mañio` potencia 0.5; todos con `dx/dy/dz` en 0.

`codigoFocos` devuelve un texto con las dos listas y un helper local `n(v)` que hace `Number(v.toFixed(2))` para que salga `0.2` y no `0.20`. La primera línea de cada bloque es `export const RIEL: FocoRiel[] = [` y `export const OBRAS: FocoObra[] = [`, cada fila va en su línea con coma, y el texto termina en `];` y salto de línea. `nombre` se serializa con `JSON.stringify`.

- [ ] **Step 4: Correr los tests y ver que pasan**

Run: `node --test tests/*.test.ts`
Expected: PASS los 6 tests (3 de antes + 3 nuevos).

- [ ] **Step 5: Verificar y commitear**

Run: `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint`
Expected: `VERIFY OK`, sin errores.

```bash
git add src/components/luces.ts tests/focos.test.ts
git commit -m "3d: lista de focos del recorrido y generador de codigo"
```

---

### Task 2: Viewer3D crea las luces desde la lista

**Files:**
- Modify: `src/components/Viewer3D.tsx:191-214` (y el import arriba)

**Interfaces:**
- Consumes: `RIEL`, `OBRAS`, `FocoRiel`, `FocoObra` de la tarea 1.
- Produces: nada público; el comportamiento visual debe ser idéntico al de `04ded42`.

- [ ] **Step 1: Reemplazar el bloque de luces**

Agregar arriba: `import { RIEL, OBRAS, type FocoObra } from "./luces";`.

Borrar el armado del `riel` con el `for` y el loop de nombres. En su lugar:

```ts
for (const f of RIEL) {
  const luz = new THREE.SpotLight(0xfff1c2, f.potencia, 6, Math.PI / 4, 0.9, 1.5);
  const p = obj.localToWorld(new THREE.Vector3(f.x, f.alto, f.z));
  luz.position.copy(p);
  luz.target.position.set(p.x, 0, p.z);
  scene.add(luz);
  scene.add(luz.target);
}
const obras = mirar ? [{ ...OBRAS[0], nombre: mirar }, ...OBRAS.slice(1)] : OBRAS;
const obrasEncontradas: FocoObra[] = [];
for (const f of obras) {
  const nodoLuz = buscar(obj, f.nombre);
  if (!nodoLuz) continue;
  const c = new THREE.Box3().setFromObject(nodoLuz).getCenter(new THREE.Vector3());
  const foco = new THREE.PointLight(0xfff1c2, f.potencia, 4, 2);
  foco.position.copy(c).multiplyScalar(0.8);
  scene.add(foco);
  obrasEncontradas.push(f);
}
```

`mirar` sigue mandando sobre la primera luz de obra (la única con `mirar` en `obras.ts`).

- [ ] **Step 2: Typecheck y lint**

Run: `npm.cmd run typecheck; npm.cmd run lint`
Expected: sin errores.

- [ ] **Step 3: Comprobar que la escena se ve igual**

Con `npm.cmd run dev`, abrir `http://localhost:3000/es/obra/gallery-map-1/` y mirar el inicio: tres cuadros, el rótulo "Vislumbres" y la ventana. Si el harness tiene herramienta de navegador, tomar una captura y comparar con `04ded42`; si no, revisar la consola del navegador sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/Viewer3D.tsx
git commit -m "3d: luces del recorrido desde la lista de focos"
```

---

### Task 3: Panel del editor

**Files:**
- Create: `src/components/EditorLuces.tsx`
- Modify: `src/components/Viewer3D.tsx` (estado de luces, marcador, guardas y montaje)

**Interfaces:**
- Consumes: `RIEL`, `OBRAS`, `FocoRiel`, `FocoObra`, `codigoFocos`.
- Produces: `EditorLuces({ riel, obra, aplicarRiel, aplicarObra, marcar })`, con
  `aplicarRiel: (i: number, f: FocoRiel) => void`,
  `aplicarObra: (i: number, f: FocoObra) => void`,
  `marcar: (grupo: "riel" | "obra", i: number | null) => void`.

- [ ] **Step 1: Crear `src/components/EditorLuces.tsx`**

Componente cliente. Estado: copias de `riel` y `obra`, `texto` (código cuando el portapapeles falla) y `copiado`. Al cambiar un campo: clona la fila, actualiza el estado y llama a `aplicarRiel`/`aplicarObra` con el índice.

Estructura: contenedor `div` con `data-luces`, `absolute bottom-3 right-3 z-20 max-h-[75%] w-[19rem] overflow-auto rounded-md bg-white/95 p-3 text-[11px] leading-tight text-neutral-900 shadow-lg`. Título "Luces (solo dev)", sección "Riel del techo" (9 filas `Riel 1`…`Riel 9`) y sección "Obras" (una fila por nombre). Cada fila muestra el nombre a la izquierda y formularios compactos: `input type="range"` con etiqueta visible (`x`, `z`, `alto`, `pot.`; en obras `pot.`, `dx`, `dy`, `dz`) y un `<output>` con el valor. Rangos: x −5..0 (paso 0.05), z −3..3, alto 2.8..3.6, pot. 0..3, dx/dy/dz −1..1.

`onPointerEnter` de la fila llama `marcar("riel"|"obra", i)`, `onPointerLeave` llama `marcar(grupo, null)`. Abajo, botón "Copiar código": `navigator.clipboard.writeText(codigoFocos(riel, obra))`; si resuelve, `copiado = true`; si falla, `texto = codigoFocos(...)`. Si hay `texto`, mostrar `<textarea readOnly value={texto} onFocus={(e) => e.currentTarget.select()} />` y la nota "Pegar en src/components/luces.ts".

- [ ] **Step 2: Guardar referencias y crear el marcador en `Viewer3D`**

Antes del loop de luces, dentro de `if (recorrer)`, declarar `const focosRiel: THREE.SpotLight[] = []` y `const focosObra: THREE.PointLight[] = []`, `const basesObra: THREE.Vector3[] = []`, y llenarlas en los loops (guardar `c.multiplyScalar(0.8)` en `basesObra`).

Marcador (una sola esfera para toda la escena): crear en el cuerpo del efecto, junto a `grupo` (así el cleanup lo ve), `new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff3b5c, depthTest: false }))`, `visible = false`, `renderOrder = 999`, `scene.add(marca)`.

- [ ] **Step 3: Estado del editor y funciones de aplicación**

En el componente:

```ts
const [editor, setEditor] = useState(false);
const [focos, setFocos] = useState<{
  riel: FocoRiel[];
  obra: FocoObra[];
  aplicarRiel: (i: number, f: FocoRiel) => void;
  aplicarObra: (i: number, f: FocoObra) => void;
  marcar: (grupo: "riel" | "obra", i: number | null) => void;
} | null>(null);
```

`aplicarRiel(i, f)`: `localToWorld(new Vector3(f.x, f.alto, f.z))`, copiar a `luz.position`, mover `luz.target.position` a `(p.x, 0, p.z)`, `target.updateMatrixWorld()`, `luz.intensity = f.potencia`.
`aplicarObra(i, f)`: `luz.position.copy(basesObra[i]).add(new Vector3(f.dx, f.dy, f.dz))`, `luz.intensity = f.potencia`.
`marcar(grupo, i)`: `marca.visible = i !== null`; si hay índice, `marca.position.copy(luz.position)` de la luz correspondiente (riel u obra).

Después de crear las luces, `setFocos({ riel: RIEL.map((f) => ({ ...f })), obra: obrasEncontradas.map((f) => ({ ...f })), aplicarRiel, aplicarObra, marcar })`, usando la lista `obrasEncontradas` de la tarea 2 (solo los nodos que existen). Al empezar el efecto, `setFocos(null)`.

- [ ] **Step 4: Activar con `?luces` solo en desarrollo**

```ts
useEffect(() => {
  if (process.env.NODE_ENV !== "development") return;
  setEditor(new URLSearchParams(window.location.search).has("luces"));
}, []);
```

En el `return`, dentro del `div.visor`: `{editor && focos && <EditorLuces {...focos} />}`. Import estático arriba.

- [ ] **Step 5: Evitar que el panel mueva la cámara**

Helper `const esPanel = (e: Event) => e.target instanceof Element && !!e.target.closest("[data-luces]");`. Salir temprano si `esPanel(e)` en `abajo`, `mover`, `rueda`, `clic` y `tecla` (cubre `teclaAbajo` y `teclaArriba`). Sin esto, un clic en el panel encuadra una obra y la rueda hace zoom.

- [ ] **Step 6: Liberar el marcador**

En el cleanup: `marca.geometry.dispose()` y `(marca.material as THREE.Material).dispose()`.

- [ ] **Step 7: Comprobar en el navegador**

Con `npm.cmd run dev`, abrir `http://localhost:3000/es/obra/gallery-map-1/?luces`. Comprobar: aparece el panel; mover un `x` de un foco cambia la luz; pasar el puntero por una fila muestra la esferita; clic y rueda sobre el panel no encuadran ni hacen zoom; "Copiar código" copia (o muestra el texto si el navegador lo bloquea); sin `?luces` no aparece nada. Cambiar `mirar` en `obras.ts` a un nombre inexistente y confirmar que su fila desaparece sin romper el resto; revertirlo.

- [ ] **Step 8: Typecheck, lint y commit**

Run: `npm.cmd run typecheck; npm.cmd run lint`
Expected: sin errores.

```bash
git add src/components/EditorLuces.tsx src/components/Viewer3D.tsx
git commit -m "3d: editor de luces con ?luces solo en desarrollo"
```

---

### Task 4: Documentación, build y push

**Files:**
- Modify: `AGENTS.md` (párrafo de luces y modo recorrer)

- [ ] **Step 1: Documentar**

En el párrafo del punto de inicio, agregar: los focos viven en `src/components/luces.ts` (`RIEL` y `OBRAS`); con `?luces` en desarrollo se abre `EditorLuces` para mover y ajustar en vivo y copiar el código; en producción no aparece. `mirar` sigue mandando sobre la primera luz de obra.

- [ ] **Step 2: Verificación completa**

Run: `npm.cmd run verify; npm.cmd run typecheck; npm.cmd run lint; node --test tests/*.test.ts`
Expected: todo OK y 6 tests en verde.

- [ ] **Step 3: Build y comprobación de producción**

Run: `npm.cmd run build` (si aparece el aviso de seguridad de Next 16, reintentar una vez).
Expected: build verde. Servir `out/` y abrir `/es/obra/gallery-map-1/?luces`: el panel no debe aparecer.

- [ ] **Step 4: Commit y push**

```bash
git add AGENTS.md
git commit -m "docs: editor de luces en desarrollo"
git push origin main
```

No agregar `README.md` ni `docs/` que ya venían modificados de antes.
