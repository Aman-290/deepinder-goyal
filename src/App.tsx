import HeroSection from './components/HeroSection'
import PortraitSection from './components/PortraitSection'
import JourneySection from './components/JourneySection'
import MicroFrictionSection from './components/MicroFrictionSection'
import EternalConglomerateSection from './components/EternalConglomerateSection'
import DeliveryMatrixGame from './components/DeliveryMatrixGame'
import SystemLogTimeline from './components/SystemLogTimeline'
import CrucibleSection from './components/CrucibleSection'
import FounderFlashcards from './components/FounderFlashcards'
import FrontierSection from './components/FrontierSection'
import EasterEggs from './components/EasterEggs'
import ScrollProgressBar from './components/ScrollProgressBar'
import CustomCursor from './components/CustomCursor'
import AmbientSound from './components/AmbientSound'

function App() {
  return (
    <div className="bg-bg text-ink min-h-screen font-sans overflow-x-hidden">
      <CustomCursor />
      <ScrollProgressBar />
      <EasterEggs />
      <AmbientSound />

      <div id="hero">
        <HeroSection />
      </div>
      <div id="portrait">
        <PortraitSection />
      </div>
      <div id="journey">
        <JourneySection />
      </div>
      <div id="micro-friction">
        <MicroFrictionSection />
      </div>
      <div id="eternal">
        <EternalConglomerateSection />
      </div>
      <div id="delivery-matrix">
        <DeliveryMatrixGame />
      </div>
      <div id="timeline">
        <SystemLogTimeline />
      </div>
      <div id="crucible">
        <CrucibleSection />
      </div>
      <div id="flashcards">
        <FounderFlashcards />
      </div>
      <div id="frontier">
        <FrontierSection />
      </div>

      {/* Footer */}
      <footer className="relative py-20 text-center border-t border-line">
        <p className="hud-text text-zomato mb-2">/// END OF LOG</p>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient mb-4">
          THE CALCULUS OF CONVICTION
        </h2>
        <p className="hud-text text-muted">
          SYSTEM OPTIMIZED // DEEPINDER GOYAL
        </p>
        <p className="hud-text text-muted/50 mt-8">
          BUILT BY FORCE AT{' '}
          <a href="#" className="text-zomato hover:underline">Brokai Labs</a>
        </p>
      </footer>
    </div>
  )
}

export default App
