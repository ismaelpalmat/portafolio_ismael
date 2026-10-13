"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export async function cargarModelo(
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
  glitchZoom = false
}: {
  modelo: string;
  formato: "obj" | "stl" | "glb";
  titulo: string;
  cuadrado?: boolean;
  distancia?: number;
  glitchZoom?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const izq = new THREE.SpotLight(0xbfe3c6, 35, 30, Math.PI / 3.5, 0.9);
    izq.position.set(-4, 2, 3);
    const der = new THREE.SpotLight(0xcabdea, 35, 30, Math.PI / 3.5, 0.9);
    der.position.set(4, 2, 3);
    scene.add(izq);
    scene.add(der);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const grupo = new THREE.Group();
    scene.add(grupo);
    const reserva = mallaProcedural();
    grupo.add(reserva);
    let vivo = true;
    if (modelo) {
      cargarModelo(modelo, formato).then((obj) => {
        if (!vivo || !obj) {
          return;
        }
        const caja = new THREE.Box3().setFromObject(obj);
        const tam = new THREE.Vector3();
        caja.getSize(tam);
        const centro = new THREE.Vector3();
        caja.getCenter(centro);
        const max = Math.max(tam.x, tam.y, tam.z) || 1;
        obj.position.set(-centro.x, -centro.y, -centro.z);
        obj.scale.setScalar(2.2 / max);
        grupo.remove(reserva);
        grupo.add(obj);
      });
    }
    let theta = 0.6;
    let phi = 1.1;
    let radio = distancia;
    let arrastrando = false;
    let moviendo = false;
    let ultimoX = 0;
    let ultimoY = 0;
    const abajo = (e: PointerEvent) => {
      arrastrando = true;
      moviendo = false;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const mover = (e: PointerEvent) => {
      if (!arrastrando) {
        return;
      }
      if (!moviendo) {
        moviendo = true;
        if (glitchZoom) {
          glitch();
        }
      }
      theta -= (e.clientX - ultimoX) * 0.006;
      phi = Math.min(Math.PI - 0.15, Math.max(0.15, phi - (e.clientY - ultimoY) * 0.006));
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
      if (!arrastrando) {
        theta += 0.008;
      }
      const jit = performance.now() < glitchHasta ? (Math.random() - 0.5) * 0.06 : 0;
      camera.position.set(
        radio * Math.sin(phi) * Math.sin(theta + jit),
        radio * Math.cos(phi + jit * 0.5),
        radio * Math.sin(phi) * Math.cos(theta + jit)
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
      el.removeEventListener("pointerdown", abajo);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerup", soltar);
      el.removeEventListener("pointercancel", soltar);
      el.removeEventListener("wheel", rueda);
      grupo.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          const mt = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mt)) {
            mt.forEach((x) => x.dispose());
          } else {
            mt.dispose();
          }
        }
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [modelo, formato, distancia]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={titulo}
      style={{ touchAction: "none" }}
      className={cuadrado ? "visor cuadrado" : "visor"}
    />
  );
}
