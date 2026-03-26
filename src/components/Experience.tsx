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

const holdColors = ["#00ffff", "#ff0000", "#ffea00", "#ff3366", "#b026ff", "#ff8800"];

function InteractiveShape({ isHolding, shapeIndex }: { isHolding: boolean, shapeIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHolding ? 4 : 0.5);
      meshRef.current.rotation.x += delta * (isHolding ? 2 : 0.3);
      const targetScale = isHolding ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, isHolding ? 0.4 : 0, 0.1);
    }
  });

  const currentShape = holdShapes[shapeIndex % holdShapes.length];
  const currentColor = holdColors[shapeIndex % holdColors.length];

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef}>
        {currentShape}
        <MeshDistortMaterial
          ref={materialRef}
          color={isHolding ? currentColor : "#00ffff"}
          speed={5}
          distort={0.4}
        />
      </mesh>
    </Float>
  );
}

export default function Experience({ isHolding, shapeIndex }: ExperienceProps) {
  const currentColor = holdColors[shapeIndex % holdColors.length];

  return (
    <div className="fixed inset-0 z-0">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={["#0a0a0a"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <InteractiveShape isHolding={isHolding} shapeIndex={shapeIndex} />
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={1} 
            far={10} 
            color={isHolding ? currentColor : "#000000"}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
