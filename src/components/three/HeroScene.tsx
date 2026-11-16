"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The actual 3D content — a small cluster of wireframe polyhedra at
 * different depths plus a sparse point field, all idling with a slow
 * independent rotation and tilting gently toward the cursor. Restrained on
 * purpose: thin wireframes, no bloom/glow post-processing, a handful of
 * objects — this is meant to read as quiet depth behind the hero copy, not
 * a showpiece that competes with it (the brief is explicit about avoiding
 * excessive glow and oversized gradients, and that still applies in 3D).
 */
function Scene() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // All four shapes sit to the right of screen-center, clustered loosely
  // around the avatar/terminal card in hero-visual — never over the
  // headline/copy column on the left. They were originally spread across
  // the full width (two of them landing with wireframe edges directly over
  // body text), which is exactly the "competing with the hero copy" the
  // comment above warns against; keeping them right-of-center is what
  // actually delivers on "quiet depth behind the hero copy".
  const shapes = useMemo(
    () => [
      { geo: new THREE.IcosahedronGeometry(1.15, 0), pos: [2.4, 0.6, -1.5] as const, speed: 0.06, color: "#4f7dff" },
      { geo: new THREE.OctahedronGeometry(0.75, 0), pos: [3.3, -1.6, -2.4] as const, speed: -0.09, color: "#8b6bff" },
      { geo: new THREE.TorusGeometry(0.6, 0.18, 8, 28), pos: [1.6, -1.7, -3.2] as const, speed: 0.1, color: "#36d399" },
      { geo: new THREE.TetrahedronGeometry(0.55, 0), pos: [2.0, 1.8, -2.6] as const, speed: -0.07, color: "#4f7dff" },
    ],
    []
  );

  const particles = useMemo(() => {
    const count = 140;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = pointer.current.y * 0.18;
    const targetY = pointer.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;

    group.current.children.forEach((child, i) => {
      const s = shapes[i];
      if (s) child.rotation.y += s.speed * delta;
      if (s) child.rotation.x += s.speed * 0.6 * delta;
    });

    state.camera.position.z = 7 + Math.sin(state.clock.elapsedTime * 0.08) * 0.15;
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh key={i} geometry={s.geo} position={s.pos}>
          <meshBasicMaterial color={s.color} wireframe transparent opacity={0.45} />
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
        <pointsMaterial color="#9aa3bd" size={0.028} transparent opacity={0.5} sizeAttenuation />
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
