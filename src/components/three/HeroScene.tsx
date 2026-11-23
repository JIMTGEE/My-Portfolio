"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * The actual 3D content: a stylized laptop with a "live" code-editor screen,
 * rendered in real geometry (not a flat wireframe silhouette) with an actual
 * light rig so the chassis picks up real blue/violet rim highlights instead
 * of reading as either flat neon line-art or a plain dark slab. Replaces an
 * earlier pass built from abstract floating wireframe polyhedra — concrete
 * "this is a developer's machine" iconography reads immediately, where
 * abstract crystals didn't land. A handful of small floating UI chips orbit
 * it for depth/movement, echoing real interface chrome rather than random
 * geometry. Everything still idles with its own slow rotation and tilts
 * toward the cursor, and the whole group breathes with a slow ambient drift
 * so it never looks static even before the pointer moves.
 */
function Scene() {
  const group = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const activeLine = useRef<THREE.Mesh>(null);
  const chips = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  // How far into the hero's own scroll-through we are, 0→1. Read directly
  // off window.scrollY rather than wiring GSAP/ScrollTrigger into the R3F
  // tree — this is the one number the scene needs, and a plain scroll
  // listener is cheaper than giving the canvas its own ScrollTrigger
  // instance. Drives a real rotation the pointer-tilt above doesn't: proof,
  // on a trackpad with the mouse never moving, that scrolling itself is
  // turning the scene — the previous pass only reacted to the pointer.
  const scrollT = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const heroHeight = () => document.getElementById("top")?.offsetHeight ?? window.innerHeight;
    const onScroll = () => {
      scrollT.current = Math.min(1, Math.max(0, window.scrollY / heroHeight()));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lines of "code" on the screen: a sidebar strip plus rows of varying
  // width/color so it reads as an editor at a glance without needing an
  // actual texture (no asset to load, nothing that can fail to fetch).
  const codeLines = useMemo(() => {
    const colors = ["#397BFF", "#8957F5", "#32D9F5", "#929DB2", "#929DB2"];
    return Array.from({ length: 9 }, (_, i) => ({
      y: 0.62 - i * 0.135,
      width: 0.4 + ((i * 37) % 10) / 10 / 1.6,
      color: colors[i % colors.length],
    }));
  }, []);

  const chipDefs = useMemo(
    () => [
      { pos: [0.1, 1.7, -0.6] as const, color: "#397BFF", speed: 0.6 },
      { pos: [3.1, 0.7, -0.9] as const, color: "#32D9F5", speed: 0.5 },
      { pos: [1.2, -2.1, -0.4] as const, color: "#8957F5", speed: 0.7 },
    ],
    []
  );

  const particles = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9 - 3;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const st = scrollT.current;
    // Scroll adds a full, unmistakable quarter-turn + a vertical climb on
    // top of the existing pointer-tilt and idle drift — big enough that it
    // reads immediately as "scrolling moves the scene," not another
    // fraction-of-a-degree wobble indistinguishable from the idle sway.
    const targetX = pointer.current.y * 0.14 + Math.sin(t * 0.05) * 0.03 + st * 0.35;
    const targetY = pointer.current.x * 0.22 + Math.cos(t * 0.04) * 0.04 + st * 0.75;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
    group.current.position.y += (st * 1.4 - group.current.position.y) * 0.06;

    // The lid leans back a touch further as you scroll in, as if the
    // machine is being opened toward you. Small angles only — the lid
    // stands up along the hinge group's own (near-vertical) local Y axis,
    // so this is a gentle recline, not a 0→90° swing.
    if (hinge.current) {
      const targetOpen = -0.12 - st * 0.08;
      hinge.current.rotation.x += (targetOpen - hinge.current.rotation.x) * 0.05;
    }

    // The "active line" highlight glides down the screen and loops — the
    // one piece of the laptop that's unmistakably alive even with the
    // pointer sitting still.
    if (activeLine.current) {
      const cycle = (t * 0.25) % 1;
      activeLine.current.position.y = 0.62 - cycle * 1.08;
      const mat = activeLine.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + Math.sin(t * 4) * 0.15;
    }

    if (chips.current) {
      chips.current.children.forEach((chip, i) => {
        const d = chipDefs[i];
        if (!d) return;
        chip.position.y = chipDefs[i].pos[1] + Math.sin(t * d.speed + i * 2) * 0.18;
        chip.rotation.y = Math.sin(t * d.speed * 0.5 + i) * 0.3;
      });
    }

    // Scroll also dollies the camera in, so depth itself visibly shifts
    // rather than the whole group only spinning as one flat unit.
    state.camera.position.z = 7.2 + Math.sin(t * 0.08) * 0.15 - st * 1.8;
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.85} color="#4a5c92" />
      <directionalLight position={[2.5, 3.5, 5]} intensity={1.6} color="#c7d2ff" />
      {/* Rim/back light — sits behind and above the laptop, facing the
          camera, so the chassis gets a bright edge separating it from the
          near-black page background instead of just blending into it. This
          one light is what actually makes the laptop read as an object in
          the dark rather than a silhouette-less void. */}
      <pointLight position={[1.8, 1.6, -2.4]} intensity={5} color="#32D9F5" distance={10} />
      <pointLight position={[-2.6, -1.2, 1.8]} intensity={2.4} color="#8957F5" distance={9} />
      <pointLight position={[2.2, -0.4, 2.6]} intensity={1.6} color="#397BFF" distance={9} />

      {/* The laptop: a base deck plus a hinged lid, tilted to read as a
          three-quarter "open on a desk, facing you" angle. Sits in the
          clear right-hand portion of the hero (the copy column's heavy
          scrim is on the left), scaled up to be the visual anchor the
          brief asked for rather than a shy accent. */}
      <group rotation={[0.08, -0.32, 0]} position={[1.55, -0.3, 0.4]} scale={1.55}>
        <RoundedBox args={[2.8, 0.14, 1.9]} radius={0.06} smoothness={4} position={[0, -0.55, 0.15]}>
          <meshStandardMaterial
            color="#32406a"
            metalness={0.75}
            roughness={0.28}
            emissive="#121c3c"
            emissiveIntensity={0.4}
          />
        </RoundedBox>
        {/* Trackpad + keyboard-deck hint, inset into the top face. */}
        <RoundedBox args={[0.7, 0.01, 0.55]} radius={0.04} position={[0, -0.478, 0.55]}>
          <meshStandardMaterial
            color="#44538a"
            metalness={0.4}
            roughness={0.5}
            emissive="#182448"
            emissiveIntensity={0.25}
          />
        </RoundedBox>
        <RoundedBox args={[2.3, 0.01, 0.75]} radius={0.03} position={[0, -0.478, -0.25]}>
          <meshStandardMaterial
            color="#3a4876"
            metalness={0.5}
            roughness={0.4}
            emissive="#162044"
            emissiveIntensity={0.3}
          />
        </RoundedBox>

        {/* Hinged lid — pivot sits at the back edge of the base so rotating
            this group swings the screen open/closed around that edge. */}
        <group ref={hinge} position={[0, -0.48, -0.78]} rotation={[-0.12, 0, 0]}>
          <RoundedBox args={[2.8, 1.72, 0.1]} radius={0.06} smoothness={4} position={[0, 0.86, 0]}>
            <meshStandardMaterial
              color="#2c3862"
              metalness={0.7}
              roughness={0.25}
              emissive="#131d40"
              emissiveIntensity={0.45}
            />
          </RoundedBox>
          {/* Soft glow bleeding around the screen bezel — a wide, faint
              halo plus a tighter, brighter one layered on top, the usual
              two-pass trick for a glow with no actual bloom pass. */}
          <mesh position={[0, 0.86, 0.06]}>
            <planeGeometry args={[3.3, 2.1]} />
            <meshBasicMaterial color="#397BFF" transparent opacity={0.16} />
          </mesh>
          <mesh position={[0, 0.86, 0.064]}>
            <planeGeometry args={[2.72, 1.64]} />
            <meshBasicMaterial color="#5fb4ff" transparent opacity={0.4} />
          </mesh>
          {/* The screen itself. */}
          <group position={[0, 0.86, 0.07]}>
            <mesh>
              <planeGeometry args={[2.46, 1.42]} />
              <meshBasicMaterial color="#060a16" />
            </mesh>
            {/* Sidebar */}
            <mesh position={[-1.0, 0, 0.002]}>
              <planeGeometry args={[0.28, 1.42]} />
              <meshBasicMaterial color="#111a30" />
            </mesh>
            {codeLines.map((l, i) => (
              <mesh key={i} position={[-0.78 + l.width / 2, l.y, 0.003]}>
                <planeGeometry args={[l.width, 0.05]} />
                <meshBasicMaterial color={l.color} transparent opacity={0.8} />
              </mesh>
            ))}
            <mesh ref={activeLine} position={[-0.6, 0.62, 0.004]}>
              <planeGeometry args={[1.5, 0.07]} />
              <meshBasicMaterial color="#32D9F5" transparent opacity={0.6} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Small floating UI chips — rounded cards with a status dot + bar,
          standing in for notification/app chrome rather than abstract
          crystals, each bobbing independently. */}
      <group ref={chips}>
        {chipDefs.map((c, i) => (
          <group key={i} position={c.pos as unknown as [number, number, number]}>
            <RoundedBox args={[0.62, 0.42, 0.04]} radius={0.06} smoothness={3}>
              <meshStandardMaterial
                color="#303e68"
                metalness={0.35}
                roughness={0.45}
                emissive="#141c38"
                emissiveIntensity={0.35}
                transparent
                opacity={0.95}
              />
            </RoundedBox>
            <mesh position={[-0.2, 0.1, 0.03]}>
              <circleGeometry args={[0.05, 16]} />
              <meshBasicMaterial color={c.color} />
            </mesh>
            <mesh position={[0.04, 0.1, 0.03]}>
              <planeGeometry args={[0.28, 0.06]} />
              <meshBasicMaterial color="#929DB2" transparent opacity={0.6} />
            </mesh>
            <mesh position={[-0.08, -0.08, 0.03]}>
              <planeGeometry args={[0.42, 0.05]} />
              <meshBasicMaterial color="#929DB2" transparent opacity={0.35} />
            </mesh>
          </group>
        ))}
      </group>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#E8EDF7" size={0.04} transparent opacity={0.6} sizeAttenuation />
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
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
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

    // A shrunk root (rootMargin's bottom value) means this counts as
    // "not intersecting" — and the render loop pauses — once the hero
    // has scrolled to roughly the top half of the viewport, rather than
    // only once it's fully gone. That hands the GPU back during the
    // scroll-past transition itself, which is exactly when it was
    // competing hardest with the scroll for frame budget.
    const io = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "demand"),
      { threshold: 0, rootMargin: "0px 0px -50% 0px" }
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
