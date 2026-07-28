"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { tiffinMotion } from "@/lib/motion";

const COLORS = {
  body: "#b7d36c",
  lid: "#c0d167",
  steel: "#d5dade",
  dark: "#2c4024",
} as const;

/** Stack layout (local Y, before the group is centered). */
const TIER_HEIGHT = 0.6;
const TIER_YS = [0.3, 0.96, 1.62];
const BAND_YS = [0.63, 1.29];
const STACK_CENTER_OFFSET = -1.35;

function TiffinCarrier({ animate }: { animate: boolean }) {
  const tiltGroup = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: COLORS.body,
        roughness: 0.42,
        metalness: 0.05,
      }),
      lid: new THREE.MeshStandardMaterial({
        color: COLORS.lid,
        roughness: 0.38,
        metalness: 0.05,
      }),
      steel: new THREE.MeshStandardMaterial({
        color: COLORS.steel,
        roughness: 0.22,
        metalness: 0.9,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: COLORS.dark,
        roughness: 0.6,
        metalness: 0.1,
      }),
    }),
    [],
  );

  const geometries = useMemo(
    () => ({
      tier: new THREE.CylinderGeometry(1, 0.96, TIER_HEIGHT, 48),
      band: new THREE.CylinderGeometry(1.03, 1.03, 0.1, 48),
      rim: new THREE.CylinderGeometry(1.01, 1.01, 0.09, 48),
      dome: new THREE.SphereGeometry(0.95, 48, 24),
      badge: new THREE.CylinderGeometry(0.24, 0.24, 0.05, 32),
      rail: new THREE.CylinderGeometry(0.045, 0.045, 2.1, 16),
      handle: new THREE.TorusGeometry(1.07, 0.05, 12, 40, Math.PI),
      grip: new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(materials).forEach((material) => material.dispose());
      Object.values(geometries).forEach((geometry) => geometry.dispose());
    },
    [materials, geometries],
  );

  useFrame((state, delta) => {
    const tilt = tiltGroup.current;
    const spin = spinGroup.current;
    if (!tilt || !spin || !animate) return;

    // Idle spin owns rotation.y; pointer tilt and bob own the outer group.
    spin.rotation.y += delta * tiffinMotion.idleSpinRadPerSec;
    tilt.position.y =
      Math.sin(state.clock.elapsedTime * tiffinMotion.bobFrequency) *
      tiffinMotion.bobAmplitude;

    const targetX = state.pointer.y * tiffinMotion.pointerTiltX;
    const targetZ = -state.pointer.x * tiffinMotion.pointerTiltZ;
    tilt.rotation.x = THREE.MathUtils.damp(
      tilt.rotation.x,
      targetX,
      tiffinMotion.damping,
      delta,
    );
    tilt.rotation.z = THREE.MathUtils.damp(
      tilt.rotation.z,
      targetZ,
      tiffinMotion.damping,
      delta,
    );
  });

  return (
    <group ref={tiltGroup}>
      <group ref={spinGroup} position={[0, STACK_CENTER_OFFSET, 0]}>
        {TIER_YS.map((y) => (
          <mesh key={y} geometry={geometries.tier} material={materials.body} position={[0, y, 0]} />
        ))}
        {BAND_YS.map((y) => (
          <mesh key={y} geometry={geometries.band} material={materials.steel} position={[0, y, 0]} />
        ))}
        {/* bottom rim and top lip */}
        <mesh geometry={geometries.rim} material={materials.steel} position={[0, 0.05, 0]} />
        <mesh geometry={geometries.rim} material={materials.steel} position={[0, 1.95, 0]} />
        {/* domed lid */}
        <mesh
          geometry={geometries.dome}
          material={materials.lid}
          position={[0, 1.99, 0]}
          scale={[1, 0.42, 1]}
        />
        {/* brand badge on the middle tier */}
        <mesh
          geometry={geometries.badge}
          material={materials.dark}
          position={[0, 0.96, 0.98]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {/* carrier frame: side rails, handle arch, grip */}
        <mesh geometry={geometries.rail} material={materials.steel} position={[-1.07, 1.05, 0]} />
        <mesh geometry={geometries.rail} material={materials.steel} position={[1.07, 1.05, 0]} />
        <mesh
          geometry={geometries.handle}
          material={materials.steel}
          position={[0, 2.1, 0]}
          scale={[1, 0.55, 1]}
        />
        <mesh
          geometry={geometries.grip}
          material={materials.dark}
          position={[0, 2.66, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />
      </group>
    </group>
  );
}

/**
 * The interactive hero scene. Rendering only runs while `animate` is true
 * (section visible, tab focused, not paused); otherwise the frameloop
 * drops to on-demand and the last frame stays on screen.
 */
export function TiffinScene({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={animate ? "always" : "demand"}
      camera={{ fov: 38, position: [0, 0.15, 6.2], near: 0.1, far: 20 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ touchAction: "pan-y", background: "transparent" }}
    >
      <hemisphereLight args={["#fdfaf0", "#a9c868", 0.65]} />
      <directionalLight position={[3.5, 5, 4]} intensity={1.4} />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={1.8} position={[0, 3, 4]} scale={[4, 2, 1]} />
        <Lightformer
          intensity={1.1}
          position={[-4, 1, -2]}
          rotation-y={-Math.PI / 2}
          scale={[3, 2, 1]}
          color="#eef7d9"
        />
        <Lightformer
          intensity={0.9}
          position={[4, 0.5, 2]}
          rotation-y={Math.PI / 2}
          scale={[3, 2, 1]}
        />
      </Environment>
      <TiffinCarrier animate={animate} />
      <ContactShadows
        position={[0, -1.42, 0]}
        opacity={0.35}
        scale={5.5}
        blur={2.4}
        far={2.5}
        frames={1}
      />
    </Canvas>
  );
}
