import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import Core from './Core';

interface ExperienceProps {
  isHolding: boolean;
  shapeIndex: number;
}

export default function Experience({ isHolding, shapeIndex }: ExperienceProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
          <div className="w-8 h-8 border-2 border-[#ff3366] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <div className="w-full h-full relative">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <color attach="background" args={["#0a0a0a"]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#00ffff" />
            
            <Core isHolding={isHolding} />

            <Environment preset="night" />
            
            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4.5}
            />
          </Canvas>
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          </div>
        </div>
      </Suspense>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-50" />
    </div>
  );
}
