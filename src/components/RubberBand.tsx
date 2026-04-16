import { useRef, useState, useCallback } from 'react';

interface RubberBandProps {
  onSnap: () => void;
}

export default function RubberBand({ onSnap }: RubberBandProps) {
  const [stretch, setStretch] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [justSnapped, setJustSnapped] = useState(false);
  const startYRef = useRef(0);

  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setJustSnapped(false);
    startYRef.current = clientY;
  }, []);

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const delta = Math.max(0, clientY - startYRef.current);
    setStretch(Math.min(delta, 120));
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (stretch > 40) {
      setStretch(0);
      setJustSnapped(true);
      onSnap();
      navigator.vibrate?.(50);
      setTimeout(() => setJustSnapped(false), 600);
    } else {
      setStretch(0);
    }
  }, [isDragging, stretch, onSnap]);

  const stretchPercent = stretch / 120;
  const bandColor = stretch > 40 ? '#E23744' : stretch > 20 ? '#cc4444' : '#555';
  const glowOpacity = stretchPercent * 0.4;

  return (
    <div
      className="flex flex-col items-center select-none touch-none cursor-grab active:cursor-grabbing py-6"
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <p className="hud-text text-muted/50 text-[11px] mb-4 tracking-wider">
        {justSnapped ? '↻ SNAPPED' : stretch > 40 ? '↓ RELEASE TO SNAP' : '↓ PULL TO SNAP · NEXT CARD'}
      </p>

      <div
        className="relative"
        style={{
          transform: `scaleY(${1 + stretchPercent * 1.2})`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Glow behind the band */}
        <div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: `radial-gradient(ellipse, rgba(226,55,68,${glowOpacity}) 0%, transparent 70%)`,
            transform: 'scale(2.5)',
          }}
        />

        <svg viewBox="0 0 160 60" className="w-40 md:w-48 relative z-10">
          {/* Shadow/glow ellipse */}
          <ellipse
            cx="80" cy="30" rx="65" ry="20"
            fill="none"
            stroke={bandColor}
            strokeWidth="1"
            opacity={0.2}
            filter="url(#band-blur)"
          />
          {/* Main band */}
          <ellipse
            cx="80" cy="30" rx="60" ry="16"
            fill="none"
            stroke={bandColor}
            strokeWidth={3 + stretchPercent * 2}
            strokeLinecap="round"
            style={{ transition: isDragging ? 'none' : 'stroke 0.3s, stroke-width 0.3s' }}
          />
          {/* Inner highlight */}
          <ellipse
            cx="80" cy="28" rx="55" ry="12"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <defs>
            <filter id="band-blur">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Snap feedback animation */}
      {justSnapped && (
        <div className="mt-2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-zomato"
              style={{
                animation: `ping 0.6s ease-out ${i * 0.1}s forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
