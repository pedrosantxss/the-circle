"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbSphere } from "./OrbSphere";
import { FloatingParticles } from "./FloatingParticles";
import { RingOrbit } from "./RingOrbit";
import * as THREE from "three";

interface HeroSceneProps {
  mouseX: number;
  mouseY: number;
}

function SceneContent({ mouseX, mouseY }: HeroSceneProps) {
  return (
    <group position={[0.35, 0.5, 0]}>
      {/*
       * Orb is fully self-lit via custom ShaderMaterial (Fresnel + shimmer).
       * No environment map needed — lights below only affect ring/particle meshes.
       */}

      {/* Faint ambient — gives ring geometry minimal visibility */}
      <ambientLight intensity={0.04} color="#ffffff" />

      {/* Orb */}
      <OrbSphere mouseX={mouseX} mouseY={mouseY} />

      {/*
       * Orbital rings — structural only, near-invisible.
       * Hint at geometry without screaming sci-fi.
       */}
      <RingOrbit radius={2.88} rotation={[Math.PI / 2,   0,           0.06]} speed={0.12}  opacity={0.05} />
      <RingOrbit radius={3.55} rotation={[Math.PI / 3.8, Math.PI / 7, 0   ]} speed={-0.07} opacity={0.03} />
      <RingOrbit radius={4.3}  rotation={[Math.PI / 5,   Math.PI / 3, 0.18]} speed={0.04}  opacity={0.018}/>

      {/* Particles — sparse dust */}
      <FloatingParticles />
    </group>
  );
}

export function HeroScene({ mouseX, mouseY }: HeroSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8.5], fov: 44, near: 0.1, far: 120 }}
      gl={{
        antialias:           true,
        alpha:               true,
        powerPreference:     "high-performance",
        toneMapping:         THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.95,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneContent mouseX={mouseX} mouseY={mouseY} />
      </Suspense>
    </Canvas>
  );
}
