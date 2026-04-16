import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ShieldAlert, TerminalSquare, AlertOctagon, Unlock, CheckCircle2, Flame } from 'lucide-react';

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
    <div ref={containerRef} className={`relative pt-12 md:pt-16 pb-24 md:pb-32 border-b border-line overflow-hidden transition-colors duration-1000 ${acknowledged ? 'bg-surface' : 'bg-bg'}`}>
      
      {/* Background static / warning effect if unacknowledged */}
      <AnimatePresence>
        {!acknowledged && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen z-0" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
          ></motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        
        <motion.div 
          animate={{ opacity: acknowledged ? 0.3 : 1 }}
          className="relative inline-flex items-center gap-3 z-30 mb-8"
        >
          {!acknowledged && <div className="w-2 h-2 rounded-full bg-zomato animate-pulse shadow-[0_0_10px_#E23744]"></div>}
          {acknowledged && <div className="w-2 h-2 rounded-full bg-hyperpure shadow-[0_0_10px_#2E8B57]"></div>}
          <div className={`hud-text text-xs border px-4 py-2 ${acknowledged ? 'border-line text-muted bg-surface/50' : 'border-zomato/40 text-zomato bg-zomato/10 shadow-[0_0_15px_rgba(226,55,68,0.2)]'} backdrop-blur-sm rounded font-bold tracking-widest transition-all duration-1000`}>
            PHASE 3: THE CRUCIBLE
          </div>
        </motion.div>

        <motion.div 
          style={{ y, opacity }}
          className="max-w-7xl w-full mx-auto relative z-20"
        >
          {/* Warning Stripes Top of Window */}
          <div className={`fixed top-0 left-0 w-full h-2 transition-all duration-1000 z-50 ${acknowledged ? 'bg-hyperpure opacity-0' : 'bg-[repeating-linear-gradient(45deg,var(--color-zomato),var(--color-zomato)_10px,transparent_10px,transparent_20px)] opacity-100'}`}></div>
            
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center w-full mt-4 md:mt-8">
              
              {/* Left Column: Narrative Text */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-8">
                  {acknowledged ? (
                    <Unlock className="text-hyperpure drop-shadow-[0_0_10px_rgba(46,139,87,0.5)]" size={48} strokeWidth={1.5} />
                  ) : (
                    <Flame className="text-zomato animate-pulse drop-shadow-[0_0_10px_rgba(226,55,68,0.8)]" size={48} strokeWidth={1.5} />
                  )}
                  <h2 className={`font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] ${acknowledged ? 'text-ink' : 'text-gradient-zomato drop-shadow-[0_0_10px_rgba(226,55,68,0.3)]'}`}>
                    Intentional<br/>Friction
                  </h2>
                </div>
                
                <div className="space-y-6 font-mono text-base md:text-lg leading-relaxed text-muted/80 relative">
                  {/* Decorative line on the left */}
                  <div className={`absolute -left-6 md:-left-8 top-2 bottom-2 w-1 rounded-full transition-colors duration-1000 ${acknowledged ? 'bg-line/50' : 'bg-zomato/50 shadow-[0_0_10px_rgba(226,55,68,0.5)]'}`}></div>
                  
                  <p className="pl-0">
                    Prolonged corporate success naturally builds <strong className="text-ink">"armor"</strong> or defensive ego around an executive, rendering them impervious to radical, transformative feedback.
                  </p>
                  <p className="pl-0">
                    By intentionally <span className={`font-bold transition-colors duration-1000 ${acknowledged ? 'text-ink' : 'text-zomato underline decoration-zomato/30 decoration-2 underline-offset-4 bg-zomato/10 px-1 rounded'}`}>dismantling this confidence</span> and inflicting controlled professional distress, Goyal aims to shatter the mental blocks that prevent exponential growth.
                  </p>
                </div>
              </div>

              {/* Right Column: Interaction & Media */}
              <div className="flex-1 w-full space-y-8">
                
                {/* Visual Asset Block */}
                <div className={`relative w-full aspect-video rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-1000 border ${acknowledged ? 'border-line/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'border-zomato/30 shadow-[0_0_30px_rgba(226,55,68,0.1)] glow-effect'}`}>
                  {/* Cinematic Overlay Tint */}
                  <div className={`absolute inset-0 z-10 mix-blend-overlay transition-colors duration-1000 ${acknowledged ? 'bg-transparent' : 'bg-zomato/20'}`}></div>
                  
                  {/* Glitch/Panic Overlay */}
                  <AnimatePresence>
                    {!acknowledged && (
                      <motion.div 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                      >
                       <AlertOctagon size={48} className="text-zomato opacity-50 absolute" strokeWidth={1} />
                       <div className="w-[150%] h-[200%] absolute animate-[spin_8s_linear_infinite] bg-[conic-gradient(transparent_270deg,var(--color-zomato)_360deg)] opacity-20 pointer-events-none mix-blend-screen -z-10"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <img 
                    src="office-culture.png" 
                    alt="Office Culture" 
                    className={`w-full h-full object-cover transition-all duration-1000 ${acknowledged ? 'opacity-80 scale-100 blur-0' : 'opacity-40 scale-110 blur-[3px] grayscale'}`} 
                    onError={(e) => e.currentTarget.style.display = 'none'} 
                  />
                  
                  {/* Warning Scanline */}
                  {!acknowledged && (
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-[2px] bg-zomato/60 z-30 shadow-[0_0_15px_#E23744]"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    ></motion.div>
                  )}
                </div>
                
                {/* Interactive Terminal */}
                <div className="relative">
                  {!acknowledged ? (
                    <div className="border border-zomato/50 rounded-2xl p-6 md:p-8 bg-surface/80 shadow-[0_0_40px_rgba(226,55,68,0.15)] backdrop-blur-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 pointer-events-none">
                        <TerminalSquare size={120} className="text-zomato" />
                      </div>
                      
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <ShieldAlert size={22} className="text-zomato animate-pulse shadow-[0_0_10px_rgba(226,55,68,0.5)] rounded-full" />
                        <div className="hud-text text-zomato text-sm font-bold tracking-[0.2em] bg-zomato/10 px-3 py-1 rounded border border-zomato/20 shadow-inner">SYS HALT: FRIDAY 6 PM RULE</div>
                      </div>
                      
                      <p className="text-sm md:text-base mb-8 font-mono text-muted/90 relative z-10 border-l-[3px] border-zomato/40 pl-5 py-1">
                        If a critical system flaw is discovered late on a Friday evening, an <span className="text-ink font-bold bg-line/30 px-1 rounded">owner-minded leader</span> does not defer the issue to Monday.
                      </p>
                      
                      <button 
                        onClick={() => setAcknowledged(true)}
                        className="w-full py-4 md:py-5 bg-zomato/10 text-zomato border border-zomato hover:bg-zomato hover:text-white font-bold uppercase tracking-[0.2em] transition-all duration-300 text-sm relative overflow-hidden group/btn rounded-xl shadow-[0_0_15px_rgba(226,55,68,0.2)] hover:shadow-[0_0_30px_rgba(226,55,68,0.6)]"
                      >
                        <div className="absolute inset-0 h-full w-4 bg-white/30 -translate-x-full group-hover/btn:animate-[scan_0.8s_ease-in-out_infinite] skew-x-12 blur-[2px]"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Execute Protocol Override
                        </span>
                      </button>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="border border-hyperpure/40 rounded-2xl p-6 md:p-8 bg-hyperpure/5 shadow-[0_0_30px_rgba(46,139,87,0.1)] flex items-center gap-6 glass"
                    >
                      <div className="w-14 h-14 rounded-full bg-hyperpure/20 flex flex-shrink-0 items-center justify-center border border-hyperpure/30 shadow-[0_0_15px_rgba(46,139,87,0.3)]">
                        <CheckCircle2 size={28} className="text-hyperpure" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="hud-text text-hyperpure text-sm md:text-base font-bold tracking-[0.2em] mb-2">FRICTION RESOLVED</div>
                        <p className="text-sm md:text-base font-mono text-ink/70">Defensive armor shed. Proceeding to the next phase of scale.</p>
                      </div>
                    </motion.div>
                  )}
                </div>

              </div>
            </div>
        </motion.div>

        {/* Global Dark overlay to focus attention if unacknowledged */}
        <AnimatePresence>
          {!acknowledged && (
            <motion.div 
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 pointer-events-none bg-black/50 backdrop-blur-[2px] transition-all duration-1000"
            ></motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
