/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

export default function App() {
  const [isHolding, setIsHolding] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  const handleHoldStart = () => setIsHolding(true);
  const handleHoldEnd = () => setIsHolding(false);

  // Prevent context menu on long press for mobile & handle dynamic background
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (isHolding) e.preventDefault();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (bgRef.current) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const hue = Math.floor(x * 60 + y * 60);
        // Dynamic background color shift based on mouse position
        bgRef.current.style.backgroundColor = isHolding 
          ? `hsl(${hue + 320}, 50%, 10%)` 
          : `hsl(${hue + 220}, 30%, 6%)`;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Set initial background
    if (bgRef.current) {
      bgRef.current.style.backgroundColor = isHolding ? `hsl(320, 50%, 10%)` : `hsl(220, 30%, 6%)`;
    }

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHolding]);

  return (
    <div 
      ref={bgRef}
      className={`relative w-full h-screen overflow-hidden transition-colors duration-700 ${isHolding ? 'font-mono' : 'font-sans'} selection:bg-white selection:text-black`}
    >
      {/* Background Image that fades in on hold */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 pointer-events-none ${isHolding ? 'opacity-40' : 'opacity-0'}`}
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <Experience isHolding={isHolding} />
      <Overlay 
        isHolding={isHolding} 
        onHoldStart={handleHoldStart} 
        onHoldEnd={handleHoldEnd} 
      />
    </div>
  );
}

