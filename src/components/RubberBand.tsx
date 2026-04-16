import { useRef, useState, useCallback } from 'react';

interface RubberBandProps {
  onSnap: () => void;
}

export default function RubberBand({ onSnap }: RubberBandProps) {
  const [stretch, setStretch] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    startYRef.current = clientY;
  }, []);

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const delta = Math.max(0, clientY - startYRef.current);
    setStretch(Math.min(delta, 100));
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (stretch > 40) {
      setStretch(0);
      onSnap();
      navigator.vibrate?.(50);
    } else {
      setStretch(0);
    }
  }, [isDragging, stretch, onSnap]);

  return (
    <div
      className="flex flex-col items-center select-none touch-none cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <p className="hud-text text-muted/40 text-[10px] mb-2">PULL TO SNAP → NEXT CARD</p>
      <div
        className="relative w-20"
        style={{
          transform: `scaleY(${1 + stretch / 100})`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg viewBox="0 0 80 24" className="w-full">
          <ellipse
            cx="40" cy="12" rx="36" ry="8"
            fill="none"
            stroke={stretch > 40 ? '#E23744' : '#666'}
            strokeWidth="3"
            style={{ transition: isDragging ? 'none' : 'stroke 0.3s' }}
          />
        </svg>
      </div>
      {stretch > 40 && (
        <p className="hud-text text-zomato text-[10px] mt-1 animate-pulse">RELEASE</p>
      )}
    </div>
  );
}
