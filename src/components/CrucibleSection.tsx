import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function CrucibleSection() {
  const [acknowledged, setAcknowledged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  // Create a "heavy" feeling by slowing down the visual progress
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.2, 1]);

  return (
    <div ref={containerRef} className="min-h-[150vh] bg-bg relative border-b border-line">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 py-12 md:px-8 overflow-hidden">
        
        <div className="absolute top-8 left-8 hud-text text-xs text-muted border border-line px-3 py-1 bg-surface/80 backdrop-blur-sm z-20">
          PHASE 3: THE CRUCIBLE
        </div>

        <motion.div 
          style={{ y, opacity }}
          className="max-w-4xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar relative z-10 shadow-2xl"
        >
          <div className="border border-line bg-surface p-6 md:p-16 relative overflow-hidden">
            {/* Warning Stripes */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,var(--color-zomato),var(--color-zomato)_10px,transparent_10px,transparent_20px)] opacity-50"></div>
            
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 text-zomato tracking-tight leading-none">
              Intentional <br/>Friction
            </h2>
            
            <div className="space-y-6 font-mono text-lg md:text-xl leading-relaxed text-muted mb-12">
              <p>
                Prolonged corporate success naturally builds "armor" or defensive ego around an executive, rendering them impervious to radical, transformative feedback.
              </p>
              <p>
                By intentionally dismantling this confidence and inflicting controlled professional distress, Goyal aims to shatter the mental blocks that prevent exponential growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="relative aspect-square bg-bg border border-line flex items-center justify-center overflow-hidden group">
                <span className="font-mono text-sm text-ink absolute z-10 px-4 py-2 bg-surface/90 border border-line">
                  office-culture.webp
                </span>
                <img src="office-culture.webp" alt="Office Culture" className="w-full h-full object-cover opacity-30" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              
              <div className="flex flex-col justify-center">
                {!acknowledged ? (
                  <div className="border border-zomato p-6 bg-zomato/5 shadow-[0_0_30px_rgba(226,55,68,0.15)]">
                    <div className="hud-text text-zomato mb-4 text-lg">SYSTEM HALT: FRIDAY 6 PM RULE</div>
                    <p className="text-base md:text-lg mb-8 font-mono">
                      If a critical system flaw is discovered late on a Friday evening, an owner-minded leader does not defer the issue to Monday.
                    </p>
                    <button 
                      onClick={() => setAcknowledged(true)}
                      className="w-full py-4 bg-zomato text-ink font-bold uppercase tracking-widest hover:bg-red-600 transition-colors text-lg"
                    >
                      Acknowledge & Resolve
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-hyperpure p-8 bg-hyperpure/5 text-hyperpure shadow-[0_0_30px_rgba(46,139,87,0.15)] h-full flex flex-col justify-center"
                  >
                    <div className="hud-text mb-4 text-xl">FRICTION RESOLVED</div>
                    <p className="text-lg font-mono">Proceed to the next phase of scale.</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overlay block if not acknowledged to simulate heavy scroll/block */}
        {!acknowledged && (
          <div className="absolute inset-0 z-0 pointer-events-none bg-bg/50 backdrop-blur-[2px]"></div>
        )}
      </div>
    </div>
  );
}
