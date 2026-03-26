import { Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ExperienceProps {
  isHolding: boolean;
  shapeIndex: number;
}

const holdShapes = [
  <coneGeometry key="cone" args={[2, 3, 3, 1]} />,
  <boxGeometry key="box" args={[1.8, 1.8, 1.8]} />,
  <torusGeometry key="torus" args={[1.2, 0.4, 32, 64]} />,
  <icosahedronGeometry key="icosa" args={[1.8, 0]} />,
  <octahedronGeometry key="octa" args={[2, 0]} />,
  <dodecahedronGeometry key="dodeca" args={[1.5, 0]} />
];

const holdColors = [
  "#00ffff", // Cyan (for initial cone)
  "#ff0000", // Red
  "#ffea00", // Yellow
  "#ff3366", // Pink
  "#b026ff", // Purple
  "#ff8800"  // Orange
];

function InteractiveShape({ isHolding, shapeIndex }: { isHolding: boolean, shapeIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentScroll = useRef(0);

  const currentColor = holdColors[shapeIndex % holdColors.length];
  const targetColor = new THREE.Color(currentColor);
  const baseColor = new THREE.Color("#00ffff");

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Read scroll position for scroll interactivity
      const scrollContainer = document.getElementById('main-scroll-container');
      const scrollY = scrollContainer ? scrollContainer.scrollTop : 0;
      
      // Smooth scroll delta
      currentScroll.current = THREE.MathUtils.lerp(currentScroll.current, scrollY, 0.05);
      const scrollRotation = currentScroll.current * 0.002;
      const scrollYOffset = currentScroll.current * 0.004;

      // Cursor interactivity (Parallax)
      targetRotation.current.x = (state.pointer.y * Math.PI) / 6;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 6;
      
      targetPosition.current.x = state.pointer.x * 1.2;
      targetPosition.current.y = state.pointer.y * 1.2;

      // Apply rotations (Base + Cursor + Scroll)
      // INCREASED SPEED during hold phase
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x, 
        targetRotation.current.x + (isHolding ? delta * 8 : delta * 0.5), 
        0.08
      );
      
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y, 
        targetRotation.current.y + scrollRotation + (isHolding ? delta * 10 : delta * 0.5), 
        0.08
      );

      // Apply position parallax
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetPosition.current.x,
        0.05
      );
      
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetPosition.current.y + Math.sin(state.clock.elapsedTime) * 0.1 - scrollYOffset,
        0.05
      );

      // Scale interactivity
      const targetScale = isHolding ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (materialRef.current) {
      // Smoothly animate material properties
      const targetDistort = isHolding ? 0.8 : 0.15; // Increased distortion on hold
      const targetSpeed = isHolding ? 10 : 1.5; // Increased speed on hold
      const targetRoughness = isHolding ? 0.05 : 0.25;
      const targetMetalness = isHolding ? 0.9 : 0.7;

      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.05);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.05);
      materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, targetRoughness, 0.05);
      materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, targetMetalness, 0.05);
      
      // Smoothly interpolate color
      materialRef.current.color.lerp(isHolding ? targetColor : baseColor, 0.08);
    }
  });

  const currentShape = holdShapes[shapeIndex % holdShapes.length];

  return (
    <Float speed={isHolding ? 10 : 2} rotationIntensity={isHolding ? 5 : 0.5} floatIntensity={isHolding ? 5 : 2}>
      <mesh ref={meshRef}>
        {/* Always use currentShape, even when not holding */}
        {currentShape}
        <MeshDistortMaterial
          ref={materialRef}
          color="#00ffff"
          envMapIntensity={2}
          metalness={0.7}
          roughness={0.25}
          distort={0.15}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

export default function Experience({ isHolding, shapeIndex }: ExperienceProps) {
  const currentColor = holdColors[shapeIndex % holdColors.length];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      }>
        <div className="w-full h-full relative">
          {/* Removed bg-[#0a0a0a] and <color attach="background" /> to allow App.tsx dynamic bg to show */}
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={2} />
            <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
            <directionalLight position={[-10, -10, -10]} intensity={2} color={isHolding ? currentColor : "#ff3366"} />
            <pointLight position={[0, 5, -5]} intensity={5} color="#00ffff" />
            
            <InteractiveShape isHolding={isHolding} shapeIndex={shapeIndex} />
            
            <ContactShadows 
              position={[0, -3, 0]} 
              opacity={0.5} 
              scale={10} 
              blur={2} 
              far={4} 
              color={isHolding ? currentColor : "#000000"}
            />
          </Canvas>
          
          {/* Post-processing-like overlays to maintain the aesthetic */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            
            <AnimatePresence>
              {isHolding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 mix-blend-overlay backdrop-blur-[2px]"
                  style={{ backgroundColor: `${currentColor}15` }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </Suspense>

      {/* Grain and Noise Overlays */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-50" />
    </div>
  );
}
