"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The actual 3D content. A deliberately bolder pass than the original
 * "quiet depth behind the hero copy" treatment: this scene is meant to be a
 * character on the page, not a decoration behind one — closer to how
 * Active Theory and Lusion use WebGL as the centerpiece of a hero rather
 * than an accent. A dense field of wireframe polyhedra spans the *full*
 * frame (not a small cluster off to one side), anchored by one oversized
 * "signature" icosahedron built from three nested, increasingly transparent
 * shells to fake a bloom/glow pass without a real post-processing pipeline.
 * Everything still idles with its own slow rotation and tilts toward the
 * cursor, and the whole group breathes with a slow ambient drift so it
 * never looks static even before the pointer moves.
 */
function Scene() {
  const group = useRef<THREE.Group>(null);
  const signature = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Spread across the entire frame now, foreground copy sits on a scrim
  // (see Hero.tsx) so legibility holds even with shapes passing behind it —
  // that trade is the point: the brief now explicitly wants the 3D to read
  // as the hero's main character, not a shy accent confined to one corner.
  const shapes = useMemo(
    () => [
      { geo: new THREE.OctahedronGeometry(0.85, 0), pos: [-3.4, 1.6, -2.2] as const, speed: -0.09, color: "#caff3f" },
      { geo: new THREE.TorusGeometry(0.55, 0.16, 8, 28), pos: [-2.6, -1.8, -1.6] as const, speed: 0.11, color: "#b06bff" },
      { geo: new THREE.TetrahedronGeometry(0.6, 0), pos: [3.6, 2.0, -2.8] as const, speed: -0.08, color: "#6a52ff" },
      { geo: new THREE.IcosahedronGeometry(0.7, 0), pos: [3.0, -1.4, -2.0] as const, speed: 0.07, color: "#caff3f" },
      { geo: new THREE.OctahedronGeometry(0.5, 0), pos: [0.2, 2.6, -3.4] as const, speed: 0.1, color: "#b06bff" },
      { geo: new THREE.TorusGeometry(0.4, 0.12, 8, 24), pos: [-1.0, -2.6, -3.0] as const, speed: -0.12, color: "#6a52ff" },
    ],
    []
  );

  const particles = useMemo(() => {
    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const targetX = pointer.current.y * 0.2 + Math.sin(t * 0.05) * 0.04;
    const targetY = pointer.current.x * 0.28 + Math.cos(t * 0.04) * 0.05;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;

    group.current.children.forEach((child, i) => {
      const s = shapes[i];
      if (s) child.rotation.y += s.speed * delta;
      if (s) child.rotation.x += s.speed * 0.6 * delta;
    });

    if (signature.current) {
      signature.current.rotation.y += delta * 0.09;
      signature.current.rotation.x = Math.sin(t * 0.15) * 0.15;
      const breathe = 1 + Math.sin(t * 0.6) * 0.03;
      signature.current.scale.setScalar(breathe);
    }

    state.camera.position.z = 7.4 + Math.sin(t * 0.08) * 0.2;
  });

  return (
    <group ref={group}>
      {/* The signature shape: one large icosahedron rendered as three
          nested wireframe shells at increasing scale / decreasing opacity.
          Cheap stand-in for bloom — no post-processing pass required. */}
      <group ref={signature} position={[0.6, -0.1, -1.2]}>
        <mesh geometry={new THREE.IcosahedronGeometry(1.5, 1)}>
          <meshBasicMaterial color="#caff3f" wireframe transparent opacity={0.55} />
        </mesh>
        <mesh geometry={new THREE.IcosahedronGeometry(1.5, 1)} scale={1.12}>
          <meshBasicMaterial color="#b06bff" wireframe transparent opacity={0.25} />
        </mesh>
        <mesh geometry={new THREE.IcosahedronGeometry(1.5, 1)} scale={1.3}>
          <meshBasicMaterial color="#6a52ff" wireframe transparent opacity={0.12} />
        </mesh>
      </group>

      {shapes.map((s, i) => (
        <mesh key={i} geometry={s.geo} position={s.pos}>
          <meshBasicMaterial color={s.color} wireframe transparent opacity={0.5} />
        </mesh>
      ))}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#cfd1e6" size={0.03} transparent opacity={0.55} sizeAttenuation />
      </points>
    </group>
  );
}

/**
 * Pauses the render loop (via R3F's "demand" frameloop + invalidate) while
 * the tab is hidden or the canvas has scrolled out of view — a continuous
 * WebGL draw loop you can't see is pure battery/CPU waste. Visible to the
 * rest of the app as a bare <Canvas>; everything else is self-contained.
 */
export default function HeroScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power", preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 7], fov: 45 }}
        frameloop="always"
        style={{ pointerEvents: "none" }}
      >
        <VisibilityGate targetRef={wrapperRef} />
        <Scene />
      </Canvas>
    </div>
  );
}

function VisibilityGate({ targetRef }: { targetRef: React.RefObject<HTMLDivElement> }) {
  // Lives inside <Canvas>, so it can reach R3F's invalidate/frameloop state
  // via the store — swapping frameloop to "demand" stops the RAF loop cold
  // without unmounting the scene (which would lose GPU-uploaded geometry).
  const setFrameloop = useThreeFrameloopSetter();

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "demand"),
      { threshold: 0 }
    );
    io.observe(el);

    const onVisibility = () =>
      setFrameloop(document.visibilityState === "visible" ? "always" : "demand");
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [setFrameloop, targetRef]);

  return null;
}

// One-line wrapper around R3F's store, kept next to its only caller rather
// than in lib/ since it's not useful outside this file.
function useThreeFrameloopSetter() {
  const set = useThree((s) => s.set);
  return (mode: "always" | "demand") => set({ frameloop: mode });
}
