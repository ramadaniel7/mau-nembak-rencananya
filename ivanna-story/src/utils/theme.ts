import { config } from '../data/config';

function triplet(hex: string): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Push the palette from config.ts into CSS variables (used by Tailwind colours). */
export function applyPalette(): void {
  const p = config.palette;
  const root = document.documentElement.style;
  root.setProperty('--c-rose', triplet(p.rosePink));
  root.setProperty('--c-soft', triplet(p.softPink));
  root.setProperty('--c-blush', triplet(p.blush));
  root.setProperty('--c-cream', triplet(p.cream));
  root.setProperty('--c-lavender', triplet(p.lavender));
  root.setProperty('--c-rose-text', triplet(p.softRoseText));
  root.setProperty('--c-ink', triplet(p.deepText));
  root.setProperty('--c-ink-deep', triplet(p.deepTextStrong));
}
