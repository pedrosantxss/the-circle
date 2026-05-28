"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RingOrbitProps {
  radius:   number;
  rotation: [number, number, number];
  speed:    number;
  opacity:  number;
}

export function RingOrbit({ radius, rotation, speed, opacity }: RingOrbitProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.z += speed * 0.003;
    ref.current.rotation.x += speed * 0.001;
  });

  return (
    <mesh ref={ref} rotation={new THREE.Euler(...rotation)}>
      <torusGeometry args={[radius, 0.002, 2, 256]} />
      <meshBasicMaterial color={0xffffff} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}
