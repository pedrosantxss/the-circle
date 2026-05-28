"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Very sparse — dust, not a star field
const COUNT = 320;

export function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);

  const [geometry, material] = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const r     = 4.2 + Math.random() * 9.5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color:           0xffffff,
      size:            0.006,
      sizeAttenuation: true,
      transparent:     true,
      opacity:         0.20,
      blending:        THREE.AdditiveBlending,
      depthWrite:      false,
    });

    return [geo, mat];
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.007;
    ref.current.rotation.x = t * 0.003;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
