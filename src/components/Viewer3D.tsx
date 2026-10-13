"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Viewer3D({
  modelo,
  formato,
  titulo,
  cuadrado
}: {
  modelo: string;
  formato: "obj" | "stl";
  titulo: string;
  cuadrado?: boolean;
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
    camera.position.set(0, 0.6, 4.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const izq = new THREE.SpotLight(0xbfd9ff, 60, 30, Math.PI / 5, 0.4);
    izq.position.set(-4, 2, 3);
    const der = new THREE.SpotLight(0xffd9b0, 60, 30, Math.PI / 5, 0.4);
    der.position.set(4, 2, 3);
    scene.add(izq);
    scene.add(der);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const geo = new THREE.TorusKnotGeometry(1, 0.32, 160, 24);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x8fb4ff,
      roughness: 0.35,
      metalness: 0.15
    });
    const malla = new THREE.Mesh(geo, mat);
    scene.add(malla);
    let vivo = true;
    let angulo = 0;
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
      angulo += 0.008;
      malla.rotation.y = angulo;
      malla.rotation.x = angulo * 0.3;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
    return () => {
      vivo = false;
      ro.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [modelo, formato]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={titulo}
      className={cuadrado ? "visor cuadrado" : "visor"}
    />
  );
}
