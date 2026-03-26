import { Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface ExperienceProps {
  isHolding: boolean;
  shapeIndex: number;
}

const holdShapes = [
  <coneGeometry key="cone" args={[2, 3, 3, 1]} />,
  <boxGeometry key="box" args={[1.8, 1.8, 1.8]} />,
  <torusGeometry key="torus" args={[1.2, 0.4, 48, 96]} />,      // higher segment count = crisper
  <icosahedronGeometry key="icosa" args={[1.8, 1]} />,            // subdivision=1 for smoother edges
  <octahedronGeometry key="octa" args={[2, 1]} />,
  <dodecahedronGeometry key="dodeca" args={[1.5, 0]} />,
];

const holdColors = [
  '#887bff', // Purple (initial)
  '#ff0000', // Red
  '#ffea00', // Yellow
  '#ff3366', // Pink
  '#b026ff', // Violet
  '#ff8800', // Orange
];

function InteractiveShape({ isHolding, shapeIndex }: { isHolding: boolean; shapeIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Accumulated rotation — frame-rate independent, no lerp jitter
  const rotVel = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const currentColor = holdColors[shapeIndex % holdColors.length];
  const targetColorObj = useRef(new THREE.Color(currentColor));
  const baseColorObj = useRef(new THREE.Color('#887bff'));

  // Keep target color in sync when shapeIndex changes
  targetColorObj.current.set(currentColor);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05); // cap delta to avoid huge jumps on tab-switch

    if (!meshRef.current) return;
    const mesh = meshRef.current;

    // --- Smooth cursor parallax (spring-like, frame-rate independent) ---
    const pxTarget = state.pointer.x * 1.0;
    const pyTarget = state.pointer.y * 1.0;
    pos.current.x += (pxTarget - pos.current.x) * (1 - Math.exp(-8 * clampedDelta));
    pos.current.y += (pyTarget - pos.current.y) * (1 - Math.exp(-8 * clampedDelta));

    mesh.position.x += (pos.current.x - mesh.position.x) * (1 - Math.exp(-6 * clampedDelta));
    mesh.position.y += (pos.current.y - mesh.position.y) * (1 - Math.exp(-6 * clampedDelta));

    // --- Rotation velocity (smooth acceleration into hold, deceleration out) ---
    const targetVelX = isHolding ? 3.5 : 0.25;
    const targetVelY = isHolding ? 5.0 : 0.4;
    const acc = isHolding ? 1 - Math.exp(-6 * clampedDelta) : 1 - Math.exp(-3 * clampedDelta);

    rotVel.current.x += (targetVelX - rotVel.current.x) * acc;
    rotVel.current.y += (targetVelY - rotVel.current.y) * acc;

    mesh.rotation.x += rotVel.current.x * clampedDelta;
    mesh.rotation.y += rotVel.current.y * clampedDelta;

    // --- Scale spring ---
    const targetScale = isHolding ? 1.28 : 1.0;
    const currentScale = mesh.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * (1 - Math.exp(-10 * clampedDelta));
    mesh.scale.setScalar(newScale);

    // --- Material transitions (smooth) ---
    if (materialRef.current) {
      const mat = materialRef.current;
      const lerpF = 1 - Math.exp(-5 * clampedDelta);

      mat.distort += ((isHolding ? 0.65 : 0.12) - mat.distort) * lerpF;
      mat.speed += ((isHolding ? 8 : 1.5) - mat.speed) * lerpF;
      mat.roughness += ((isHolding ? 0.02 : 0.2) - mat.roughness) * lerpF;
      mat.metalness += ((isHolding ? 1.0 : 0.75) - mat.metalness) * lerpF;
      mat.envMapIntensity += ((isHolding ? 4 : 2) - mat.envMapIntensity) * lerpF;

      // Color lerp
      mat.color.lerp(isHolding ? targetColorObj.current : baseColorObj.current, lerpF * 1.2);
    }

    // --- Pulse ring ---
    if (pulseRef.current) {
      const targetPulse = isHolding ? 1.6 : 0.0;
      const lerpF2 = 1 - Math.exp(-7 * clampedDelta);
      const ps = pulseRef.current.scale.x + (targetPulse - pulseRef.current.scale.x) * lerpF2;
      pulseRef.current.scale.setScalar(ps);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        isHolding ? Math.sin(state.clock.elapsedTime * 4) * 0.12 + 0.12 : 0;
    }
  });

  const currentShape = holdShapes[shapeIndex % holdShapes.length];

  return (
    <Float speed={isHolding ? 6 : 2} rotationIntensity={0} floatIntensity={isHolding ? 3 : 1.2}>
      <mesh ref={meshRef}>
        {currentShape}
        <MeshDistortMaterial
          ref={materialRef}
          color="#887bff"
          envMapIntensity={2}
          metalness={0.75}
          roughness={0.2}
          distort={0.12}
          speed={1.5}
        />
      </mesh>

      {/* Crispy pulse ring that breathes during hold */}
      <mesh ref={pulseRef} scale={0} renderOrder={1}>
        {currentShape}
        <meshBasicMaterial
          color={currentColor}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Float>
  );
}

export default function Experience({ isHolding, shapeIndex }: ExperienceProps) {
  const currentColor = holdColors[shapeIndex % holdColors.length];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          </div>
        }
      >
        <div className="w-full h-full relative">
          <Canvas
            dpr={[1, 2]}                              // crisp on retina/HiDPI
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              alpha: true,
            }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
            <directionalLight
              position={[-10, -10, -10]}
              intensity={2}
              color={isHolding ? currentColor : '#ff3366'}
            />
            <pointLight position={[0, 5, -5]} intensity={5} color="#887bff" />
            {/* Rim light that shifts color on hold */}
            <pointLight
              position={[5, -5, 5]}
              intensity={isHolding ? 8 : 2}
              color={isHolding ? currentColor : '#ffffff'}
            />

            {/* Environment for realistic reflections */}
            <Environment preset="city" />

            <InteractiveShape isHolding={isHolding} shapeIndex={shapeIndex} />

            <ContactShadows
              position={[0, -3, 0]}
              opacity={isHolding ? 0.7 : 0.4}
              scale={10}
              blur={isHolding ? 1.5 : 2.5}   // sharper shadow on hold
              far={4}
              color={isHolding ? currentColor : '#000000'}
            />
          </Canvas>

          {/* Vignette + hold color overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />

            <AnimatePresence>
              {isHolding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 mix-blend-overlay"
                  style={{ backgroundColor: `${currentColor}18` }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </Suspense>

      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-50" />
    </div>
  );
}
