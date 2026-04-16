/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HeroSection from './components/HeroSection';
import JourneySection from './components/JourneySection';
import MicroFrictionSection from './components/MicroFrictionSection';
import EternalConglomerateSection from './components/EternalConglomerateSection';
import DeliveryMatrixGame from './components/DeliveryMatrixGame';
import SystemLogTimeline from './components/SystemLogTimeline';
import CrucibleSection from './components/CrucibleSection';
import FounderFlashcards from './components/FounderFlashcards';
import FrontierSection from './components/FrontierSection';
import EasterEggs from './components/EasterEggs';

export default function App() {
  return (
    <main className="bg-bg text-ink min-h-screen selection:bg-zomato selection:text-white">
      <EasterEggs />
      <HeroSection />
      <JourneySection />
      <MicroFrictionSection />
      <EternalConglomerateSection />
      <DeliveryMatrixGame />
      <SystemLogTimeline />
      <CrucibleSection />
      <FounderFlashcards />
      <FrontierSection />
      
      <footer className="relative border-t border-line/50 py-24 bg-bg overflow-hidden flex flex-col items-center justify-center font-mono group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(226,55,68,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zomato/50 to-transparent opacity-50"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-zomato rounded-full animate-pulse shadow-[0_0_10px_#E23744]"></span>
            <span className="text-zomato font-bold tracking-[0.3em] text-xs">END OF LOG</span>
          </div>
          
          <h2 className="font-display text-2xl md:text-3xl text-ink tracking-widest mb-2 font-bold">
            THE CALCULUS OF CONVICTION
          </h2>
          <p className="text-muted/60 text-xs md:text-sm tracking-[0.2em] mb-16">
            SYSTEM OPTIMIZED / DEEPINDER GOYAL
          </p>

          <div className="flex flex-col items-center gap-3">
            <span className="text-muted/40 text-xs tracking-[0.3em]">BUILT BY FOLKS AT</span>
            <a 
              href="https://brokailabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zomato font-bold tracking-widest text-lg md:text-xl border-b-[2px] border-zomato/30 hover:border-zomato transition-all duration-300 drop-shadow-[0_0_10px_rgba(226,55,68,0.2)] hover:drop-shadow-[0_0_25px_rgba(226,55,68,0.8)] hover:text-white"
            >
              Brokai Labs
            </a>
          </div>
        </div>

        {/* Decorative terminal lines */}
        <div className="absolute bottom-8 left-8 text-[10px] text-muted/20 text-left font-mono pointer-events-none hidden md:block leading-relaxed">
           &gt; _SYS_SHUTDOWN INIT<br/>
           &gt; CONNECTION SEVERED<br/>
           &gt; MEMORY FREED
        </div>
        <div className="absolute bottom-8 right-8 text-[10px] text-muted/20 text-right font-mono pointer-events-none hidden md:block leading-relaxed">
           [EOF]<br/>
           0x000000
        </div>
      </footer>
    </main>
  );
}
