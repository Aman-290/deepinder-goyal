// src/components/ScrollProgressBar.tsx
import { useSectionObserver, SECTION_IDS, SECTION_LABELS, type SectionId } from '../hooks/useSectionObserver';

const PROGRESS_NODES: { id: SectionId; label: string }[] = [];
const seenLabels = new Set<string>();
for (const id of SECTION_IDS) {
  const label = SECTION_LABELS[id];
  if (!seenLabels.has(label)) {
    seenLabels.add(label);
    PROGRESS_NODES.push({ id, label });
  }
}

export default function ScrollProgressBar() {
  const activeSection = useSectionObserver();
  const activeIdx = PROGRESS_NODES.findIndex(
    (n) => SECTION_LABELS[activeSection] === n.label
  );

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-4 py-2 glass rounded-full">
      {PROGRESS_NODES.map((node, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        return (
          <div key={node.id} className="flex items-center">
            {i > 0 && (
              <div
                className="w-6 h-px mx-1 transition-colors duration-500"
                style={{
                  backgroundColor: isPast || isActive
                    ? 'rgba(226, 55, 68, 0.6)'
                    : 'rgba(255,255,255,0.1)',
                }}
              />
            )}
            <button
              onClick={() => {
                document.getElementById(node.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hud-text transition-all duration-500"
              style={{
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: isActive
                  ? '#E23744'
                  : isPast
                    ? 'rgba(226, 55, 68, 0.5)'
                    : 'rgba(255,255,255,0.3)',
                textShadow: isActive ? '0 0 10px rgba(226,55,68,0.4)' : 'none',
              }}
            >
              {node.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
