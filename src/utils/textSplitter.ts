import { type ReactNode, createElement } from 'react';

export function splitWords(text: string, className = ''): ReactNode[] {
  return text.split(' ').map((word, i) =>
    createElement(
      'span',
      {
        key: i,
        className: `inline-block overflow-hidden ${className}`,
        'data-word-index': i,
      },
      createElement(
        'span',
        { className: 'inline-block word-reveal', style: { transform: 'translateY(100%)' } },
        word
      ),
      i < text.split(' ').length - 1 ? '\u00A0' : ''
    )
  );
}

export function animateCounter(
  element: HTMLElement,
  target: number,
  duration = 2000,
  suffix = ''
): () => void {
  let start = 0;
  const startTime = performance.now();
  let rafId: number;

  function update(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    start = Math.round(target * eased);
    element.textContent = `${start.toLocaleString()}${suffix}`;

    if (progress < 1) {
      rafId = requestAnimationFrame(update);
    }
  }

  rafId = requestAnimationFrame(update);
  return () => cancelAnimationFrame(rafId);
}
