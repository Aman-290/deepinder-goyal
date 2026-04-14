import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg relative py-32 border-b border-line overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl relative z-10">
        <div className="hud-text text-xs text-muted mb-12 border border-line inline-block px-3 py-1">
          PHASE 0: THE ALGORITHMIC FOUNDATION
        </div>

        <motion.div style={{ y, opacity }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Formative <br/>
              <span className="text-muted">Crucibles</span>
            </h2>
            
            <div className="space-y-6 font-mono text-lg md:text-xl leading-relaxed text-muted">
              <p>
                Born in Muktsar, Punjab, Goyal's early life was punctuated by severe personal hurdles, most notably a pronounced struggle with stammering. These early experiences of vulnerability necessitated the rapid development of a resilient, internal locus of control.
              </p>
              <p>
                His academic journey led him to IIT Delhi, pursuing Mathematics and Computing. This rigorous discipline trained his mind to view the world not as static events, but as <strong className="text-ink font-bold">complex optimization problems</strong> awaiting efficiency.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Image Placeholder 1 */}
            <div className="relative w-full aspect-[4/3] bg-surface border border-line flex items-center justify-center overflow-hidden group">
              <span className="font-mono text-sm text-ink absolute z-10 px-4 py-2 bg-bg/90 border border-line shadow-2xl">
                deepinder-early-days.webp
              </span>
              <img 
                src="deepinder-early-days.webp" 
                alt="Deepinder Early Days" 
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500" 
                onError={(e) => e.currentTarget.style.display = 'none'} 
              />
              <div className="absolute inset-0 grid-bg opacity-20"></div>
            </div>

            {/* Image Placeholder 2 */}
            <div className="relative w-3/4 ml-auto aspect-video bg-surface border border-line flex items-center justify-center overflow-hidden group -mt-16 z-20 shadow-2xl">
              <span className="font-mono text-sm text-ink absolute z-10 px-4 py-2 bg-bg/90 border border-line shadow-2xl">
                iit-delhi-campus.webp
              </span>
              <img 
                src="iit-delhi-campus.webp" 
                alt="IIT Delhi" 
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500" 
                onError={(e) => e.currentTarget.style.display = 'none'} 
              />
              <div className="absolute inset-0 bg-zomato/5 mix-blend-overlay"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
