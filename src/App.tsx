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
      
      <footer className="border-t border-line py-16 text-center font-mono text-xs text-muted bg-surface">
        <p className="text-sm">THE CALCULUS OF CONVICTION</p>
        <p className="mt-2 opacity-50">SYSTEM OPTIMIZED</p>
        <p className="mt-8 text-zomato/80">Built by folks at Brokai Labs</p>
      </footer>
    </main>
  );
}
