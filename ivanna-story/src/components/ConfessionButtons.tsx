import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { config } from '../data/config';
import { content } from '../data/content';

interface Props {
  disabled?: boolean;
  onYes: () => void;
  /** the visitor really chose NO (never an infinite trap) */
  onNo: () => void;
  /** playful toast text */
  onToast: (text: string) => void;
}

const SPRING = { type: 'spring' as const, stiffness: 240, damping: 15, mass: 0.8 };
const PAD = 18;

export default function ConfessionButtons({ disabled, onYes, onNo, onToast }: Props) {
  const reduced = !!useReducedMotion();
  const zoneRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dodges = useRef(0);
  const lastDodge = useRef(0);
  const lastToast = useRef(-1);
  const [settled, setSettled] = useState(false);

  const toast = useCallback(
    (force = false) => {
      const list = content.confession.toasts;
      if (settled && !force) return;
      let i = Math.floor(Math.random() * list.length);
      if (i === lastToast.current) i = (i + 1) % list.length;
      lastToast.current = i;
      onToast(list[i]);
    },
    [onToast, settled],
  );

  const dodge = useCallback(
    (pointer?: { x: number; y: number }) => {
      const zone = zoneRef.current;
      const no = noRef.current;
      const yes = yesRef.current;
      if (!zone || !no || !yes) return;
      const z = zone.getBoundingClientRect();
      const n = no.getBoundingClientRect();
      const yr = yes.getBoundingClientRect();
      const nat = { left: n.left - x.get(), top: n.top - y.get() };
      const cx = n.left + n.width / 2;
      const cy = n.top + n.height / 2;
      const from = pointer ?? { x: cx, y: cy };

      let best: { left: number; top: number } | null = null;
      let bestScore = -1;
      for (let i = 0; i < 16; i++) {
        const left = z.left + Math.random() * Math.max(0, z.width - n.width);
        const top = z.top + Math.random() * Math.max(0, z.height - n.height);
        const overlapsYes = !(
          left + n.width < yr.left - PAD ||
          left > yr.right + PAD ||
          top + n.height < yr.top - PAD ||
          top > yr.bottom + PAD
        );
        if (overlapsYes) continue;
        const score = Math.hypot(left + n.width / 2 - from.x, top + n.height / 2 - from.y);
        if (score > bestScore) {
          bestScore = score;
          best = { left, top };
        }
      }
      if (!best) {
        // guaranteed safe fallback: centred at the bottom of the zone, below YES
        best = { left: z.left + (z.width - n.width) / 2, top: z.bottom - n.height };
      }
      animate(x, best.left - nat.left, SPRING);
      animate(y, best.top - nat.top, SPRING);
    },
    [x, y],
  );

  const registerDodge = useCallback(() => {
    dodges.current += 1;
    if (dodges.current >= config.animation.maxNoDodges) {
      setSettled(true);
      onToast(content.confession.settled);
    }
  }, [onToast]);

  // Desktop: proximity detection with pointer events.
  useEffect(() => {
    if (disabled || settled || reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const no = noRef.current;
      if (!no) return;
      const now = performance.now();
      if (now - lastDodge.current < 380) return;
      const r = no.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) < config.animation.noProximityPx) {
        lastDodge.current = now;
        dodge({ x: e.clientX, y: e.clientY });
        toast();
        registerDodge();
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [disabled, settled, reduced, dodge, toast, registerDodge]);

  const onNoClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    // keyboard activation (detail === 0), reduced motion, or the button has settled: a real "no".
    if (e.detail === 0 || reduced || settled) {
      onNo();
      return;
    }
    // touch tap / lucky mouse click: playful dodge + toast
    e.preventDefault();
    dodge();
    toast();
    registerDodge();
  };

  return (
    <div ref={zoneRef} className="relative mx-auto mt-8 h-[250px] w-[min(92vw,620px)] sm:h-[210px]">
      <div className="absolute inset-x-0 top-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <button
          ref={yesRef}
          type="button"
          onClick={onYes}
          disabled={disabled}
          className="btn btn-primary music-pulse px-8 text-[0.95rem] font-semibold"
        >
          {content.confession.yes}
        </button>
        <motion.button
          ref={noRef}
          type="button"
          onClick={onNoClick}
          disabled={disabled}
          style={{ x, y, touchAction: 'manipulation' }}
          className="btn btn-ghost px-7"
        >
          {content.confession.no}
        </motion.button>
      </div>
    </div>
  );
}
