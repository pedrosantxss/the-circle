"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Core sphere shader ───────────────────────────────────────────────────────
// Cinematic dark-space orb. No environment map required.
// Deep blue-black core + warm-silver Fresnel rim + animated inner shimmer.
// Inspired by Interstellar's Gargantua and OpenAI's visual identity.

const coreVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal  = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const coreFrag = /* glsl */ `
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float NdotV = clamp(dot(vNormal, vViewDir), 0.0, 1.0);

    // Rim — falloff from edge inward
    float rim = pow(1.0 - NdotV, 2.5);

    // Inner depth — center has barely-visible luminosity (like a star behind glass)
    float inner = pow(NdotV, 4.2) * 0.038;

    // Slow magnetic surface shimmer — almost subliminal
    float t = uTime * 0.16;
    float wave =
      sin(vNormal.x * 3.8 + t)         * sin(vNormal.y * 3.0 + t * 0.6)  * 0.005
    + sin(vNormal.z * 2.4 + t * 0.45)  * sin(vNormal.x * 4.2 + t * 0.3)  * 0.003;

    // Core: deep space black with a whisper of blue depth
    vec3 core = vec3(0.007, 0.007, 0.012) + wave;

    // Inner glow: warm, extremely faint — like heat escaping
    vec3 glow = core + vec3(0.76, 0.74, 0.71) * inner;

    // Rim: warm silver-white — the only real light on the surface
    vec3 rimColor = vec3(0.90, 0.88, 0.85) * rim;

    gl_FragColor = vec4(glow + rimColor, 1.0);
  }
`;

// ─── Halo sphere shader (BackSide) ───────────────────────────────────────────
// Soft atmospheric glow wrapping the orb's silhouette.

const haloVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal  = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const haloFrag = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float NdotV  = clamp(dot(vNormal, vViewDir), 0.0, 1.0);
    float halo   = pow(1.0 - NdotV, 1.9) * 1.1;
    vec3  color  = vec3(0.82, 0.80, 0.78) * halo;
    float alpha  = halo * 0.42;
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
interface OrbSphereProps {
  mouseX: number;
  mouseY: number;
}

export function OrbSphere({ mouseX, mouseY }: OrbSphereProps) {
  const groupRef = useRef<THREE.Group>(null);
  const target   = useRef({ x: 0, y: 0 });

  const coreMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms:     { uTime: { value: 0 } },
        vertexShader:   coreVert,
        fragmentShader: coreFrag,
        side:           THREE.FrontSide,
      }),
    []
  );

  const haloMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms:       {},
        vertexShader:   haloVert,
        fragmentShader: haloFrag,
        side:           THREE.BackSide,
        transparent:    true,
        blending:       THREE.AdditiveBlending,
        depthWrite:     false,
      }),
    []
  );

  // Outer faint bloom — pure white, nearly invisible
  const bloomMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color:       new THREE.Color(1, 1, 1),
        transparent: true,
        opacity:     0.009,
        side:        THREE.BackSide,
        depthWrite:  false,
        blending:    THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsed = clock.elapsedTime;

    // Update time uniform for shimmer
    coreMat.uniforms.uTime.value = elapsed;

    // Very slow, dignified mouse parallax
    target.current.x += (mouseX - target.current.x) * 0.014;
    target.current.y += (mouseY - target.current.y) * 0.014;

    groupRef.current.rotation.y = elapsed * 0.024 + target.current.x * 0.16;
    groupRef.current.rotation.x =
      Math.sin(elapsed * 0.014) * 0.035 + target.current.y * 0.09;

    // Breathing — so slow it reads as stillness, not animation
    groupRef.current.scale.setScalar(1 + Math.sin(elapsed * 0.22) * 0.007);
  });

  return (
    <group ref={groupRef}>
      {/* Core: dark sphere with custom shader */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[2.0, 256, 256]} />
        <primitive object={coreMat} attach="material" />
      </mesh>

      {/* Halo: BackSide atmospheric rim */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[2.1, 64, 64]} />
        <primitive object={haloMat} attach="material" />
      </mesh>

      {/* Bloom: outer diffuse glow */}
      <mesh renderOrder={2}>
        <sphereGeometry args={[2.6, 32, 32]} />
        <primitive object={bloomMat} attach="material" />
      </mesh>
    </group>
  );
}
