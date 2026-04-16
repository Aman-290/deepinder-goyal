import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function EasterEggs() {
  const [karma, setKarma] = useState(4.98);
  const [showGarage, setShowGarage] = useState(false);
  const [showBillboard, setShowBillboard] = useState(false);
  const [activeCar, setActiveCar] = useState<'lambo' | 'aston'>('lambo');

  // Simulate karma changes based on scroll/time
  useEffect(() => {
    const interval = setInterval(() => {
      setKarma(prev => {
        const change = (Math.random() - 0.4) * 0.05;
        return Math.min(5.0, Math.max(4.0, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Karma Score (Nav Bar) */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setShowGarage(true)}
            className="w-8 h-8 flex items-center justify-center border border-line bg-surface hover:bg-line transition-colors text-xs"
            title="Access Garage"
          >
            🏎️
          </button>
          <button 
            onClick={() => setShowBillboard(true)}
            className="w-8 h-8 flex items-center justify-center border border-line bg-surface hover:bg-line transition-colors text-xs"
            title="View Billboard"
          >
            📢
          </button>
        </div>
        <div className="border border-line bg-surface px-4 py-2 flex items-center gap-2">
          <span className="text-zomato text-xs">★</span>
          <span className="font-mono text-sm font-bold">{karma.toFixed(2)}</span>
        </div>
      </div>

      {/* Garage Modal */}
      <AnimatePresence>
        {showGarage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 backdrop-blur-sm p-4"
          >
            <div className="w-full max-w-4xl border border-line bg-surface p-8 relative">
              <button 
                onClick={() => setShowGarage(false)}
                className="absolute top-4 right-4 text-muted hover:text-ink"
              >
                ✕
              </button>
              
              <div className="hud-text text-muted mb-8">SECURE FACILITY: THE GARAGE</div>
              
              <div className="flex gap-4 mb-8 border-b border-line pb-4">
                <button 
                  onClick={() => setActiveCar('lambo')}
                  className={`font-display text-xl uppercase ${activeCar === 'lambo' ? 'text-ink' : 'text-muted'}`}
                >
                  Huracan Sterrato
                </button>
                <button 
                  onClick={() => setActiveCar('aston')}
                  className={`font-display text-xl uppercase ${activeCar === 'aston' ? 'text-ink' : 'text-muted'}`}
                >
                  Aston Martin DB12
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-video bg-line/20 flex items-center justify-center border border-line relative overflow-hidden">
                  {/* Placeholder for car image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent z-20 pointer-events-none"></div>
                  {activeCar === 'lambo' ? (
                    <img src="Huracan.jpg" alt="Huracan Sterrato" className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <span className="text-6xl relative z-10">🚙</span>
                  )}
                </div>
                
                <div className="font-mono text-sm space-y-4">
                  {activeCar === 'lambo' ? (
                    <>
                      <div className="flex justify-between border-b border-line/50 pb-2">
                        <span className="text-muted">TYPE</span>
                        <span>Off-road capable supercar</span>
                      </div>
                      <div className="flex justify-between border-b border-line/50 pb-2">
                        <span className="text-muted">EXCLUSIVITY</span>
                        <span>1 of 1,499 globally</span>
                      </div>
                      <div className="flex justify-between border-b border-line/50 pb-2">
                        <span className="text-muted">SYSTEM</span>
                        <span>LDVI equipped</span>
                      </div>
                      <div className="flex justify-between border-b border-line/50 pb-2">
                        <span className="text-muted">EST. VALUE</span>
                        <span>₹4.6 Crore</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between border-b border-line/50 pb-2">
                        <span className="text-muted">FINISH</span>
                        <span>Satin Aston Martin Racing Green</span>
                      </div>
                      <div className="flex justify-between border-b border-line/50 pb-2">
                        <span className="text-muted">ENGINE</span>
                        <span>4-liter twin-turbo V8</span>
                      </div>
                      <div className="flex justify-between border-b border-line/50 pb-2">
                        <span className="text-muted">STATUS</span>
                        <span>India's first customer-delivered unit</span>
                      </div>
                      <div className="flex justify-between border-b border-line/50 pb-2">
                        <span className="text-muted">EST. VALUE</span>
                        <span>₹4.5 Crore+</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Billboard Modal (Draggable) */}
      <AnimatePresence>
        {showBillboard && (
          <motion.div 
            drag
            dragConstraints={{ left: 0, right: window.innerWidth - 400, top: 0, bottom: window.innerHeight - 300 }}
            initial={{ opacity: 0, scale: 0.9, x: 100, y: 100 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[90] w-[400px] cursor-move"
          >
            <div className="border border-line bg-surface shadow-2xl">
              <div className="bg-line px-4 py-2 flex justify-between items-center">
                <span className="hud-text text-xs">CULTURAL_VIRALITY.EXE</span>
                <button onClick={() => setShowBillboard(false)} className="text-muted hover:text-ink">✕</button>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {/* Blinkit Billboard */}
                <div className="bg-[#F8CB46] text-black p-6 text-center font-bold text-xl">
                  Doodh mangoge,<br/>doodh denge
                  <div className="text-xs mt-4 font-normal">blinkit</div>
                </div>
                {/* Zomato Billboard */}
                <div className="bg-[#E23744] text-white p-6 text-center font-bold text-xl">
                  Kheer mangoge,<br/>kheer denge
                  <div className="text-xs mt-4 font-normal">zomato</div>
                </div>
                <div className="mt-4 font-mono text-xs text-muted">
                  &gt; Organic impressions: 50M+<br/>
                  &gt; CAC reduction: Significant<br/>
                  &gt; Status: Viral
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
