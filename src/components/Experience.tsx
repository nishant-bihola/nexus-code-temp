import { Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ExperienceProps {
  isHolding: boolean;
  shapeIndex: number;
}

function Diamond({ isHolding, shapeIndex }: { isHolding: boolean; shapeIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate faster when holding
      meshRef.current.rotation.y += delta * (isHolding ? 2 : 0.2);
      meshRef.current.rotation.x += delta * (isHolding ? 1.5 : 0.1);
      
      // Scale up slightly when holding
      const targetScale = isHolding ? 1.5 : 1;
      meshRef.current.scale.setScalar(
        meshRef.current.scale.x + (targetScale - meshRef.current.scale.x) * 0.1
      );
    }
  });

  const shapes = [
    <coneGeometry key="triangle" args={[2, 3, 3, 1]} />, // Clean 3D Triangle
    <boxGeometry key="cube" args={[2.2, 2.2, 2.2]} />, // Clean Cube
    <torusGeometry key="torus" args={[1.5, 0.5, 32, 64]} />, // Clean Torus
    <icosahedronGeometry key="icosahedron" args={[2, 0]} /> // Clean Icosahedron
  ];
  
  const colors = [
    "#00ffff", // Cyan
    "#b026ff", // Purple
    "#ffea00", // Yellow
    "#39ff14"  // Neon Green
  ];

  const currentShape = shapes[shapeIndex % shapes.length];
  const currentColor = colors[shapeIndex % colors.length];

  return (
    <Float speed={isHolding ? 5 : 2} rotationIntensity={isHolding ? 2 : 0.5} floatIntensity={isHolding ? 5 : 2}>
      <mesh ref={meshRef} scale={[1, 1, 1]}>
        {currentShape}
        <MeshDistortMaterial
          color={isHolding ? "#ff3366" : currentColor}
          envMapIntensity={2}
          metalness={0.7}
          roughness={0.1}
          distort={isHolding ? 0.8 : 0}
          speed={isHolding ? 6 : 0}
        />
      </mesh>
    </Float>
  );
}

export default function Experience({ isHolding, shapeIndex }: ExperienceProps) {
  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      }>
        <div className="w-full h-full relative">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <color attach="background" args={['#0a0a0a']} />
            <ambientLight intensity={2} />
            <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
            <directionalLight position={[-10, -10, -10]} intensity={2} color="#ff3366" />
            <pointLight position={[0, 5, -5]} intensity={5} color="#00ffff" />
            
            <Diamond isHolding={isHolding} shapeIndex={shapeIndex} />
            
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
