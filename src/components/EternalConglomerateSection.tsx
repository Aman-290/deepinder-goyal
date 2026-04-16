import { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
const EternalConstellation = lazy(() => import('./EternalConstellation'));

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
        <div className="hud-text text-xs text-muted mb-16 border border-line inline-block px-3 py-1 self-start bg-surface/80">
          PHASE 2: THE ETERNAL CONGLOMERATE
        </div>

        <Suspense fallback={<div className="h-[400px] flex items-center justify-center text-muted/30 hud-text">LOADING CONSTELLATION...</div>}>
          <EternalConstellation activePillar={activePillar.name} onPillarClick={(name) => {
            const found = pillars.find((p) => p.name === name);
            if (found) setActivePillar(found);
          }} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 flex-grow items-center">
          {/* Left: Interactive Pillars */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-6">
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.id}
                className="border border-line p-6 md:p-8 cursor-pointer relative overflow-hidden group bg-surface/50 backdrop-blur-sm"
                onHoverStart={() => setActivePillar(pillar)}
                onClick={() => setActivePillar(pillar)}
                whileHover={{ scale: 1.02, x: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: pillar.color }}
                ></div>
                
                <div className="flex justify-between items-center relative z-10">
                  <h3 className="font-display text-3xl md:text-4xl font-bold transition-colors duration-300"
                      style={{ color: activePillar.id === pillar.id ? pillar.color : 'var(--color-ink)' }}>
                    {pillar.name}
                  </h3>
                  <div className="hud-text text-sm opacity-50">SYS.NODE.{pillar.id.toUpperCase()}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Dynamic Data Display */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="border border-line p-8 md:p-16 relative bg-surface shadow-2xl h-full flex flex-col justify-center"
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
