import { Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ExperienceProps {
  isHolding: boolean;
}

function InteractiveShape({ isHolding }: { isHolding: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentScroll = useRef(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Read scroll position for scroll interactivity
      const scrollContainer = document.getElementById('main-scroll-container');
      const scrollY = scrollContainer ? scrollContainer.scrollTop : 0;
      
      // Smooth scroll delta
      currentScroll.current = THREE.MathUtils.lerp(currentScroll.current, scrollY, 0.1);
      const scrollRotation = currentScroll.current * 0.002;

      // Cursor interactivity (Parallax)
      targetRotation.current.x = (state.pointer.y * Math.PI) / 4;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 4;

      // Apply rotations (Base + Cursor + Scroll)
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x, 
        targetRotation.current.x + (isHolding ? delta * 2 : delta * 0.5), 
        0.1
      );
      
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y, 
        targetRotation.current.y + scrollRotation + (isHolding ? delta * 3 : delta * 0.5), 
        0.1
      );

      // Scale interactivity
      const targetScale = isHolding ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={isHolding ? 5 : 2} rotationIntensity={isHolding ? 2 : 0.5} floatIntensity={isHolding ? 5 : 2}>
      <mesh ref={meshRef}>
        {isHolding ? (
          <icosahedronGeometry args={[2, 0]} /> // Morphs to Icosahedron on hold
        ) : (
          <coneGeometry args={[2, 3, 3, 1]} /> // Starts/Reverts to Triangle
        )}
        <MeshDistortMaterial
          color={isHolding ? "#ff3366" : "#00ffff"}
          envMapIntensity={2}
          metalness={0.8}
          roughness={0.1}
          distort={isHolding ? 0.6 : 0}
          speed={isHolding ? 6 : 0}
        />
      </mesh>
    </Float>
  );
}

export default function Experience({ isHolding }: ExperienceProps) {
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
            <directionalLight position={[-10, -10, -10]} intensity={2} color="#ff3366" />
            <pointLight position={[0, 5, -5]} intensity={5} color="#00ffff" />
            
            <InteractiveShape isHolding={isHolding} />
            
            <ContactShadows 
              position={[0, -3, 0]} 
              opacity={0.5} 
              scale={10} 
              blur={2} 
              far={4} 
              color={isHolding ? "#ff3366" : "#000000"}
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
                  className="absolute inset-0 bg-[#ff3366]/5 mix-blend-overlay backdrop-blur-[2px]"
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
