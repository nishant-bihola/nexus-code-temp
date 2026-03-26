import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface CoreProps {
  isHolding: boolean;
}

export default function Core({ isHolding }: CoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [textureIndex, setTextureIndex] = useState(0);

  // Preload some textures for the "images" part
  const textureUrls = [
    'https://picsum.photos/seed/nexus1/512/512',
    'https://picsum.photos/seed/nexus2/512/512',
    'https://picsum.photos/seed/nexus3/512/512',
    'https://picsum.photos/seed/nexus4/512/512',
  ];

  const textures = useLoader(THREE.TextureLoader, textureUrls, (loader) => {
    loader.setCrossOrigin('anonymous');
  });

  // Pick a new shape and texture each time we start holding
  useEffect(() => {
    if (isHolding) {
      setShapeIndex(Math.floor(Math.random() * 3));
      setTextureIndex(Math.floor(Math.random() * textures.length));
    }
  }, [isHolding, textures.length]);

  // Animation state
  const targetScale = isHolding ? 2.8 : 1.3;
  const targetRotationSpeed = isHolding ? 5 : 0.4;

  useFrame((state, delta) => {
    if (!meshRef.current || !wireRef.current) return;

    const time = state.clock.elapsedTime;

    // Smoothly interpolate scale
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.set(s, s, s);
    wireRef.current.scale.set(s * 1.01, s * 1.01, s * 1.01);
    
    // Rotate
    meshRef.current.rotation.y += delta * targetRotationSpeed;
    meshRef.current.rotation.z += delta * (targetRotationSpeed * 0.2);
    wireRef.current.rotation.copy(meshRef.current.rotation);

    // Floating effect
    if (!isHolding) {
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.15;
      wireRef.current.position.y = meshRef.current.position.y;
    } else {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
      wireRef.current.position.y = meshRef.current.position.y;
      
      // Glitchy jitter when holding
      const jitter = (Math.random() - 0.5) * 0.05;
      meshRef.current.position.x = jitter;
      wireRef.current.position.x = jitter;
    }
  });

  const geometry = (
    <>
      {shapeIndex === 0 && <icosahedronGeometry args={[1, 15]} />}
      {shapeIndex === 1 && <sphereGeometry args={[1, 64, 64]} />}
      {shapeIndex === 2 && <torusKnotGeometry args={[0.7, 0.3, 128, 32]} />}
    </>
  );

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {geometry}
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={1}
          roughness={0.05}
          thickness={0.8}
          ior={1.4}
          chromaticAberration={isHolding ? 1.5 : 0.08}
          anisotropy={0.5}
          distortion={isHolding ? 2.5 : 0.1}
          distortionScale={isHolding ? 1.8 : 0.2}
          temporalDistortion={isHolding ? 1.2 : 0.1}
          color={isHolding ? "#ff3366" : "#ffffff"}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          // Apply the selected texture when holding
          map={isHolding ? textures[textureIndex] : null}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh ref={wireRef}>
        {geometry}
        <meshBasicMaterial 
          color={isHolding ? "#ff3366" : "#ffffff"} 
          wireframe 
          transparent 
          opacity={isHolding ? 0.4 : 0.05} 
        />
      </mesh>

      {/* Pulse effect */}
      {isHolding && (
        <mesh scale={[1.15, 1.15, 1.15]}>
          {geometry}
          <meshBasicMaterial 
            color="#ff3366" 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </Float>
  );
}
