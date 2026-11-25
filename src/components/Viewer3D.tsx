"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

async function cargarModelo(
  url: string,
  formato: "obj" | "stl" | "glb"
): Promise<THREE.Object3D | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    if (formato === "obj") {
      const texto = await res.text();
      return new OBJLoader().parse(texto);
    }
    if (formato === "glb") {
      const gbuf = await res.arrayBuffer();
      const gltf = await new GLTFLoader().parseAsync(gbuf, "");
      return gltf.scene;
    }
    const buf = await res.arrayBuffer();
    const geo = new STLLoader().parse(buf);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x8fb4ff,
      roughness: 0.4,
      metalness: 0.1
    });
    return new THREE.Mesh(geo, mat);
  } catch {
    return null;
  }
}

// GLTFLoader sanea los nombres ("Plane.004" -> "Plane004"), así que se buscan sin signos.
function buscar(obj: THREE.Object3D, nombre: string): THREE.Object3D | undefined {
  const limpio = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const buscado = limpio(nombre);
  let encontrado: THREE.Object3D | undefined;
  obj.traverse((n) => {
    if (!encontrado && n.name && limpio(n.name) === buscado) {
      encontrado = n;
    }
  });
  return encontrado;
}

function liberar(o: THREE.Object3D) {
  o.traverse((x) => {
    const m = x as THREE.Mesh;
    if (m.isMesh) {
      m.geometry.dispose();
      const mt = m.material as THREE.Material | THREE.Material[];
      (Array.isArray(mt) ? mt : [mt]).forEach((k) => k.dispose());
    }
  });
}

function mallaProcedural(): THREE.Mesh {
  const geo = new THREE.TorusKnotGeometry(1, 0.32, 160, 24);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x8fb4ff,
    roughness: 0.35,
    metalness: 0.15
  });
  return new THREE.Mesh(geo, mat);
}

export default function Viewer3D({
  modelo,
  formato,
  titulo,
  cuadrado,
  distancia = 4.2,
  glitchZoom = false,
  thetaInicial = 0.6,
  phiInicial = 1.1,
  velocidad = 0.008,
  luzFrente = false,
  reservaProcedural = true,
  zoomAuto = 0,
  focoSuperior = false,
  recorrer = false,
  mirar,
  aviso
}: {
  modelo: string;
  formato: "obj" | "stl" | "glb";
  titulo: string;
  cuadrado?: boolean;
  distancia?: number;
  glitchZoom?: boolean;
  thetaInicial?: number;
  phiInicial?: number;
  velocidad?: number;
  luzFrente?: boolean;
  reservaProcedural?: boolean;
  zoomAuto?: number;
  focoSuperior?: boolean;
  recorrer?: boolean;
  mirar?: string;
  aviso?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [sinModelo, setSinModelo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const scene = new THREE.Scene();
    const claro = () => document.documentElement.dataset.tema === "claro";
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const colorIzq = () => (recorrer ? 0xffffff : claro() ? 0x2f8f52 : 0xbfe3c6);
    const colorDer = () => (recorrer ? 0xffffff : claro() ? 0x6d4ec9 : 0xcabdea);
    const intensidadSpot = recorrer ? 0 : luzFrente ? 10 : 35;
    const izq = new THREE.SpotLight(colorIzq(), intensidadSpot, 30, Math.PI / 3.5, 0.9);
    izq.position.set(-4, 2, 3);
    const der = new THREE.SpotLight(colorDer(), intensidadSpot, 30, Math.PI / 3.5, 0.9);
    der.position.set(4, 2, 3);
    scene.add(izq);
    scene.add(der);
    const intensidadAmbiente = () => (recorrer ? 1 : luzFrente ? 0.6 : claro() ? 0.55 : 0.35);
    const ambiente = new THREE.AmbientLight(0xffffff, intensidadAmbiente());
    scene.add(ambiente);
    if (luzFrente) {
      const frente = new THREE.DirectionalLight(0xffffff, 3.2);
      frente.position.set(0, 0.5, 5);
      scene.add(frente);
    }
    if (focoSuperior) {
      const arriba = new THREE.DirectionalLight(0xffffff, 3);
      arriba.position.set(0, 6, 0);
      scene.add(arriba);
    }
    const aplicarLuces = () => {
      izq.color.set(colorIzq());
      der.color.set(colorDer());
      ambiente.intensity = intensidadAmbiente();
    };
    const observador = new MutationObserver(aplicarLuces);
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
    const grupo = new THREE.Group();
    scene.add(grupo);
    const reserva = reservaProcedural ? mallaProcedural() : null;
    if (reserva) {
      grupo.add(reserva);
    }
    let vivo = true;
    let modeloVisto: THREE.Object3D | undefined;
    if (modelo) {
      cargarModelo(modelo, formato).then((obj) => {
        if (!vivo) {
          if (obj) {
            liberar(obj);
          }
          return;
        }
        if (!obj) {
          setSinModelo(true);
          return;
        }
        const caja = new THREE.Box3().setFromObject(obj);
        const tam = new THREE.Vector3();
        caja.getSize(tam);
        const centro = new THREE.Vector3();
        caja.getCenter(centro);
        const max = Math.max(tam.x, tam.y, tam.z) || 1;
        const esc = (recorrer ? 6 : 2.2) / max;
        obj.scale.setScalar(esc);
        obj.position.set(-centro.x * esc, -centro.y * esc, -centro.z * esc);
        if (reserva) {
          grupo.remove(reserva);
          liberar(reserva);
        }
        grupo.add(obj);
        if (recorrer) {
          modeloVisto = obj;
          obj.updateMatrixWorld(true);
          const pasillo = new THREE.PointLight(0xfff1c2, 6, 10, 1.5);
          pasillo.position.set(0, 1.5, 0);
          scene.add(pasillo);
          for (const nombre of [mirar ?? "", "Text.003", "dibujo mañio", "paisaje_hztl_mañio"]) {
            const nodoLuz = buscar(obj, nombre);
            if (nodoLuz) {
              const c = new THREE.Box3().setFromObject(nodoLuz).getCenter(new THREE.Vector3());
              const foco = new THREE.PointLight(0xfff1c2, 1.6, 4, 2);
              foco.position.copy(c).multiplyScalar(0.8);
              scene.add(foco);
            }
          }
          // Arranque en la sala con más obras (coordenadas del glb), mirando a sus cuadros.
          const inicio = obj.localToWorld(new THREE.Vector3(-3.6, 0, -1.0));
          const rumbo = obj.localToWorld(new THREE.Vector3(-1.46, 0, -0.3));
          x = inicio.x;
          z = inicio.z;
          yaw = Math.atan2(-(rumbo.x - inicio.x), -(rumbo.z - inicio.z));
          pitch = 0;
        }
      });
    }
    let theta = thetaInicial;
    let phi = phiInicial;
    let radio = distancia;
    let yaw = 0;
    let pitch = 0;
    let x = 0;
    let z = 0;
    const teclas = new Set<string>();
    const tecla = (e: KeyboardEvent, activa: boolean) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (!recorrer || !/^(w|a|s|d|ArrowUp|ArrowDown|ArrowLeft|ArrowRight)$/.test(k)) {
        return;
      }
      e.preventDefault();
      if (activa) {
        teclas.add(k);
      } else {
        teclas.delete(k);
      }
    };
    const teclaAbajo = (e: KeyboardEvent) => tecla(e, true);
    const teclaArriba = (e: KeyboardEvent) => tecla(e, false);
    const limpiarTeclas = () => teclas.clear();
    let ya = 0;
    let bloqueo: { pos: THREE.Vector3; mira: THREE.Vector3; giro: number; libre: { x: number; ya: number; z: number; yaw: number; pitch: number } } | null = null;
    const rayoClic = new THREE.Raycaster();
    const obraDe = (h: THREE.Intersection): THREE.Object3D | null => {
      for (let o: THREE.Object3D | null = h.object; o; o = o.parent) {
        if (/^(dibujo|paisaje|Plane)/.test(o.name)) {
          return o;
        }
      }
      return null;
    };
    const clic = (e: MouseEvent) => {
      if (!recorrer || moviendo) {
        return;
      }
      if (bloqueo) {
        ({ x, ya, z, yaw, pitch } = bloqueo.libre);
        bloqueo = null;
        return;
      }
      if (!modeloVisto) {
        return;
      }
      const r = el.getBoundingClientRect();
      rayoClic.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      const hits = rayoClic.intersectObject(modeloVisto, true);
      const hit = hits.find((h) => obraDe(h));
      const obra = hit && obraDe(hit);
      if (!hit || !obra || !hit.face) {
        return;
      }
      const caja = new THREE.Box3().setFromObject(obra);
      const tam = caja.getSize(new THREE.Vector3());
      const mira = caja.getCenter(new THREE.Vector3());
      const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
      if (normal.dot(camera.position.clone().sub(mira)) < 0) {
        normal.negate();
      }
      const lado = Math.max(tam.x, tam.y, 0.05);
      const dist = (lado / 2 / Math.tan(Math.PI / 8)) * 1.3;
      const pos = mira.clone().addScaledVector(normal, dist);
      bloqueo = { pos, mira, giro: 0, libre: { x, ya, z, yaw, pitch } };
    };
    el.addEventListener("click", clic);
    const rayo = new THREE.Raycaster();
    rayo.far = 0.35;
    const choca = (sx: number, sz: number) => {
      if (!modeloVisto) {
        return false;
      }
      rayo.set(new THREE.Vector3(x, 0, z), new THREE.Vector3(sx, 0, sz));
      return rayo.intersectObject(modeloVisto, true).length > 0;
    };
    let arrastrando = false;
    let moviendo = false;
    let ultimoX = 0;
    let ultimoY = 0;
    let origenX = 0;
    let origenY = 0;
    const abajo = (e: PointerEvent) => {
      if (e.button === 1) {
        e.preventDefault();
      }
      arrastrando = true;
      moviendo = false;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      origenX = e.clientX;
      origenY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const mover = (e: PointerEvent) => {
      if (!arrastrando) {
        return;
      }
      if (!moviendo && Math.hypot(e.clientX - origenX, e.clientY - origenY) > 4) {
        moviendo = true;
        if (glitchZoom) {
          glitch();
        }
      }
      if (recorrer && bloqueo && (e.buttons & 4) !== 0) {
        const arriba = new THREE.Vector3(0, 1, 0);
        const rel = bloqueo.pos.clone().sub(bloqueo.mira);
        const nuevoGiro = Math.min(1.22, Math.max(-1.22, bloqueo.giro + (ultimoX - e.clientX) * 0.01));
        rel.applyAxisAngle(arriba, nuevoGiro - bloqueo.giro);
        bloqueo.giro = nuevoGiro;
        const eje = new THREE.Vector3().crossVectors(rel, arriba);
        if (eje.lengthSq() > 0) {
          const alt = rel.clone().applyAxisAngle(eje.normalize(), (e.clientY - ultimoY) * 0.01);
          const angulo = alt.angleTo(arriba);
          if (angulo > 0.2 && angulo < Math.PI - 0.2) {
            rel.copy(alt);
          }
        }
        bloqueo.pos.copy(rel.add(bloqueo.mira));
      } else if (recorrer && (e.buttons & 4) !== 0) {
        const adelante = (ultimoY - e.clientY) * 0.01;
        const lateral = (e.clientX - ultimoX) * 0.01;
        const dx = -adelante * Math.sin(yaw) + lateral * Math.cos(yaw);
        const dz = -adelante * Math.cos(yaw) - lateral * Math.sin(yaw);
        if (dx && !choca(Math.sign(dx), 0)) {
          x += dx;
        }
        if (dz && !choca(0, Math.sign(dz))) {
          z += dz;
        }
      } else if (recorrer) {
        yaw -= (e.clientX - ultimoX) * 0.004;
        pitch = Math.min(1.2, Math.max(-1.2, pitch - (e.clientY - ultimoY) * 0.004));
      } else {
        theta -= (e.clientX - ultimoX) * 0.006;
        phi = Math.min(Math.PI - 0.15, Math.max(0.15, phi - (e.clientY - ultimoY) * 0.006));
      }
      ultimoX = e.clientX;
      ultimoY = e.clientY;
    };
    const soltar = () => {
      arrastrando = false;
    };
    let glitchHasta = 0;
    const GLITCHES: Array<[number, number]> = [[40, -30], [120, 200], [280, 90], [180, 320]];
    let ultimoGlitch = -1;
    let temporizador: ReturnType<typeof setTimeout> | undefined;
    const glitch = () => {
      glitchHasta = performance.now() + 200;
      let i = Math.floor(Math.random() * GLITCHES.length);
      if (i === ultimoGlitch) {
        i = (i + 1) % GLITCHES.length;
      }
      ultimoGlitch = i;
      el.style.setProperty("--g1", GLITCHES[i][0] + "deg");
      el.style.setProperty("--g2", GLITCHES[i][1] + "deg");
      el.classList.remove("zoom-glitch");
      void el.offsetWidth;
      el.classList.add("zoom-glitch");
      if (temporizador) {
        clearTimeout(temporizador);
      }
      temporizador = setTimeout(() => el.classList.remove("zoom-glitch"), 220);
    };
    const rueda = (e: WheelEvent) => {
      if (recorrer && bloqueo) {
        e.preventDefault();
        let distancia = Math.min(3, Math.max(0.05, bloqueo.pos.distanceTo(bloqueo.mira) * (1 + e.deltaY * 0.001)));
        const direccion = bloqueo.pos.clone().sub(bloqueo.mira).normalize();
        if (modeloVisto) {
          rayoClic.set(bloqueo.mira, direccion);
          rayoClic.far = Infinity;
          const pared = rayoClic.intersectObject(modeloVisto, true).find((h) => h.distance > 0.02);
          if (pared && pared.distance < distancia) {
            distancia = Math.max(0.05, pared.distance - 0.05);
          }
        }
        bloqueo.pos.copy(bloqueo.mira).addScaledVector(direccion, distancia);
        return;
      }
      if (recorrer) {
        e.preventDefault();
        camera.fov = Math.min(45, Math.max(20, camera.fov * (1 + e.deltaY * 0.001)));
        camera.updateProjectionMatrix();
        return;
      }
      if (!glitchZoom && !e.ctrlKey) {
        return;
      }
      e.preventDefault();
      radio = Math.min(8, Math.max(2.2, radio * (1 + e.deltaY * 0.001)));
      if (glitchZoom) {
        glitch();
      }
    };
    el.addEventListener("pointerdown", abajo);
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerup", soltar);
    el.addEventListener("pointercancel", soltar);
    el.addEventListener("wheel", rueda, { passive: false });
    el.addEventListener("keydown", teclaAbajo);
    el.addEventListener("keyup", teclaArriba);
    el.addEventListener("blur", limpiarTeclas);
    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const tick = () => {
      if (!vivo) {
        return;
      }
      if (recorrer) {
        if (bloqueo) {
          camera.position.copy(bloqueo.pos);
          camera.lookAt(bloqueo.mira);
          renderer.render(scene, camera);
          requestAnimationFrame(tick);
          return;
        }
        const avance = (teclas.has("w") || teclas.has("ArrowUp") ? 1 : 0) - (teclas.has("s") || teclas.has("ArrowDown") ? 1 : 0);
        const lado = (teclas.has("d") || teclas.has("ArrowRight") ? 1 : 0) - (teclas.has("a") || teclas.has("ArrowLeft") ? 1 : 0);
        const dx = (-avance * Math.sin(yaw) + lado * Math.cos(yaw)) * 0.03;
        const dz = (-avance * Math.cos(yaw) - lado * Math.sin(yaw)) * 0.03;
        if (dx && !choca(Math.sign(dx), 0)) {
          x += dx;
        }
        if (dz && !choca(0, Math.sign(dz))) {
          z += dz;
        }
        camera.position.set(x, ya, z);
        camera.rotation.set(pitch, yaw, 0, "YXZ");
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
        return;
      }
      if (!arrastrando) {
        theta += velocidad;
      }
      const jit = performance.now() < glitchHasta ? (Math.random() - 0.5) * 0.06 : 0;
      const r = radio + Math.sin(performance.now() * 0.0002) * zoomAuto;
      camera.position.set(
        r * Math.sin(phi) * Math.sin(theta + jit),
        r * Math.cos(phi + jit * 0.5),
        r * Math.sin(phi) * Math.cos(theta + jit)
      );
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
    return () => {
      vivo = false;
      if (temporizador) {
        clearTimeout(temporizador);
      }
      ro.disconnect();
      observador.disconnect();
      el.removeEventListener("pointerdown", abajo);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerup", soltar);
      el.removeEventListener("pointercancel", soltar);
      el.removeEventListener("wheel", rueda);
      el.removeEventListener("click", clic);
      el.removeEventListener("keydown", teclaAbajo);
      el.removeEventListener("keyup", teclaArriba);
      el.removeEventListener("blur", limpiarTeclas);
      liberar(grupo);
      renderer.dispose();
      renderer.forceContextLoss();
      el.removeChild(renderer.domElement);
    };
  }, [modelo, formato, distancia, glitchZoom, thetaInicial, phiInicial, velocidad, luzFrente, reservaProcedural, zoomAuto, focoSuperior, recorrer, mirar]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={titulo}
      tabIndex={recorrer ? 0 : undefined}
      style={{ touchAction: "pan-y" }}
      className={cuadrado ? "visor cuadrado" : "visor"}
    >
      {sinModelo && aviso && <p className="visor-aviso">{aviso}</p>}
    </div>
  );
}
