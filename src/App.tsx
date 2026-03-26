/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

export default function App() {
  const [isHolding, setIsHolding] = useState(false);

  const handleHoldStart = () => setIsHolding(true);
  const handleHoldEnd = () => setIsHolding(false);

  // Prevent context menu on long press for mobile
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (isHolding) e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [isHolding]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] font-sans selection:bg-white selection:text-black">
      <Experience isHolding={isHolding} />
      <Overlay 
        isHolding={isHolding} 
        onHoldStart={handleHoldStart} 
        onHoldEnd={handleHoldEnd} 
      />
    </div>
  );
}

