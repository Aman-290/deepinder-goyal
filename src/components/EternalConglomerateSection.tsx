import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import EternalConstellation from './EternalConstellation';

const pillars = [
  {
    id: 'zomato',
    name: 'Zomato',
    color: 'var(--color-zomato)',
    stat: '24M+',
    label: 'Monthly Active Customers',
    desc: 'The legacy foundational engine, focused on food delivery and restaurant discovery.',
    image: 'zomato-delivery.png'
  },
  {
    id: 'blinkit',
    name: 'Blinkit',
    color: 'var(--color-blinkit)',
    stat: '<10m',
    label: 'Quick Commerce Delivery',
    desc: 'The undisputed quick-commerce titan. Sub-10-minute delivery redefining retail.',
    image: 'blinkit-darkstore.png'
  },
  {
    id: 'district',
    name: 'District',
    color: 'var(--color-district)',
    stat: 'LIVE',
    label: 'Experiential Economy',
    desc: 'A highly curated venture specifically focused on the "going-out" and experiential economy.',
    image: 'district-events.png'
  },
  {
    id: 'hyperpure',
    name: 'Hyperpure',
    color: 'var(--color-hyperpure)',
    stat: '100k+',
    label: 'Restaurant Outlets Supplied',
    desc: 'A robust B2B platform addressing the deeply fragmented and inefficient Indian food supply chain.',
    image: 'hyperpure-supply.png'
  }
];

export default function EternalConglomerateSection() {
  const [activePillar, setActivePillar] = useState(pillars[0]);

  return (
    <div className="min-h-screen bg-bg relative py-32 border-b border-line flex flex-col overflow-hidden">
      <div className="absolute inset-0 transition-colors duration-1000 opacity-5" style={{ backgroundColor: activePillar.color }}></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 flex-grow flex flex-col">
        <div className="hud-text text-xs text-muted mb-8 border border-line inline-block px-3 py-1 self-start bg-surface/80">
          PHASE 2: THE ETERNAL CONGLOMERATE
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 flex-grow items-center relative z-10 w-full">
          {/* Left: The Network Map (Replaced Solar System) */}
          <div className="lg:col-span-5 h-[400px] lg:h-[600px] relative border border-line bg-surface/50 overflow-hidden">
            <div className="absolute top-4 left-4 hud-text text-[10px] text-muted/50 z-20">SYS.ECOSYSTEM_MAP</div>
            <EternalConstellation 
              activePillar={activePillar.name} 
              onPillarClick={(name) => {
                const found = pillars.find((p) => p.name === name);
                if (found) {
                  if ((document as any).startViewTransition) {
                    (document as any).startViewTransition(() => {
                      setActivePillar(found);
                    });
                  } else {
                    setActivePillar(found);
                  }
                }
              }} 
            />
          </div>

          {/* Middle: Interactive Pillars */}
          <div className="lg:col-span-3 flex flex-col justify-center gap-4">
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.id}
                className="border border-line p-4 md:p-6 cursor-pointer relative overflow-hidden group bg-surface/50 backdrop-blur-sm"
                onHoverStart={() => setActivePillar(pillar)}
                onClick={() => {
                  if ((document as any).startViewTransition) {
                    (document as any).startViewTransition(() => {
                      setActivePillar(pillar);
                    });
                  } else {
                    setActivePillar(pillar);
                  }
                }}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: pillar.color }}
                ></div>
                
                <div className="flex flex-col gap-2 relative z-10">
                  <div className="hud-text text-[10px] opacity-70">SYS.NODE.{pillar.id}</div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold transition-colors duration-300"
                      style={{ color: activePillar.id === pillar.id ? pillar.color : 'var(--color-ink)' }}>
                    {pillar.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Dynamic Data Display */}
          <div className="lg:col-span-4 flex flex-col justify-center h-[500px] lg:h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="border border-line p-8 md:p-16 relative bg-surface shadow-2xl h-full flex flex-col justify-center"
                style={{ viewTransitionName: 'pillar-data' }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-2"
                  style={{ backgroundColor: activePillar.color }}
                ></div>
                
                <div className="grid-bg absolute inset-0 opacity-20"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="hud-text text-sm mb-8 inline-block px-3 py-1 border" style={{ color: activePillar.color, borderColor: activePillar.color }}>
                    ACTIVE DATA STREAM
                  </div>
                  
                  <div className="font-display text-7xl md:text-9xl font-bold mb-4 tracking-tighter leading-none" style={{ color: activePillar.color }}>
                    {activePillar.stat}
                  </div>
                  
                  <div className="font-mono text-lg md:text-xl text-muted uppercase tracking-widest mb-12">
                    {activePillar.label}
                  </div>
                  
                  <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mb-12 text-ink/90">
                    {activePillar.desc}
                  </p>

                  {/* Image Placeholder */}
                  <div className="relative w-full h-64 bg-bg border border-line flex items-center justify-center overflow-hidden mt-auto">

                    <img 
                      src={activePillar.image} 
                      alt={activePillar.name} 
                      className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
                      onError={(e) => e.currentTarget.style.display = 'none'} 
                    />
                    <div className="absolute inset-0 mix-blend-overlay opacity-50" style={{ backgroundColor: activePillar.color }}></div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
