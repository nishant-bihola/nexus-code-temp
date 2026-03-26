import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette, ChromaticAberration, Scanline, Glitch } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';
import Core from './Core';
import { Suspense } from 'react';

interface ExperienceProps {
  isHolding: boolean;
}

export default function Experience({ isHolding }: ExperienceProps) {
  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
      <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

          <Core isHolding={isHolding} />

          <Environment preset="night" />
          
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4.5}
          />

          <EffectComposer>
            <Bloom 
              luminanceThreshold={1} 
              mipmapBlur 
              intensity={isHolding ? 2 : 0.6} 
              radius={0.5} 
            />
            <Noise opacity={0.08} />
            <Vignette eskil={false} offset={0.1} darkness={1.2} />
            <Scanline opacity={0.05} />
            
            {isHolding && (
              <>
                <ChromaticAberration 
                  offset={new THREE.Vector2(0.01, 0.01)} 
                />
                <Glitch 
                  delay={new THREE.Vector2(0.1, 0.5)} 
                  duration={new THREE.Vector2(0.1, 0.3)} 
                  strength={new THREE.Vector2(0.1, 0.3)} 
                  mode={GlitchMode.SPORADIC}
                />
              </>
            )}
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
