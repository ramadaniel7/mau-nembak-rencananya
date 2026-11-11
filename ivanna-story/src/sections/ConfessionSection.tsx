import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Stage from '../components/Stage';
import ConfessionButtons from '../components/ConfessionButtons';
import { content } from '../data/content';
import { rng } from '../utils/random';

type Phase = 'ask' | 'yes' | 'declined' | 'farewell';

function HeartBurst({ reduced }: { reduced: boolean }) {
  const hearts = useMemo(() => {
    const r = rng(99);
    return Array.from({ length: 30 }, (_, i) => {
      const a = (i / 30) * Math.PI * 2 + r() * 0.4;
      const d = 90 + r() * 220;
      return { id: i, x: Math.cos(a) * d, y: Math.sin(a) * d - 40, s: 16 + r() * 26, delay: r() * 0.3, rot: (r() - 0.5) * 60 };
    });
  }, []);
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute text-rosepink"
          style={{ fontSize: h.s, textShadow: '0 0 14px #fff' } as CSSProperties}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{ x: h.x, y: h.y, scale: [0, 1.3, 1], opacity: [0, 1, 0.9, 0], rotate: h.rot }}
          transition={{ duration: 2.4, delay: h.delay, ease: 'easeOut' }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}

interface Props {
  onAnswerYes: () => void;
  onFinish: () => void;
}

export default function ConfessionSection({ onAnswerYes, onFinish }: Props) {
  const reduced = !!useReducedMotion();
  const [phase, setPhase] = useState<Phase>('ask');
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const toastTimer = useRef<number | null>(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const showToast = useCallback((text: string) => {
    setToast({ id: Date.now(), text });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const yes = () => {
    if (phase !== 'ask') return;
    onAnswerYes();
    setPhase('yes');
  };

  // YES: celebrate for a moment, then roll into the cinematic scene
  useEffect(() => {
    if (phase !== 'yes') return;
    const t = window.setTimeout(() => finishRef.current(), reduced ? 1800 : 3600);
    return () => window.clearTimeout(t);
  }, [phase, reduced]);

  const leave = () => {
    try {
      window.close();
    } catch {
      /* browsers usually block this for tabs not opened by script */
    }
    setPhase('farewell');
  };

  return (
    <Stage>
      <motion.div
        className="flex w-full max-w-2xl flex-col items-center text-center"
        animate={{ opacity: phase === 'ask' ? 1 : 0.0 }}
        transition={{ duration: 0.6 }}
        aria-hidden={phase !== 'ask'}
      >
        <p className="font-vibes text-4xl text-rosetext glow-soft sm:text-5xl">{content.confession.dear}</p>
        <h1 className="mt-4 font-playfair text-[1.9rem] leading-tight text-inkdeep sm:text-5xl">{content.confession.question}</h1>
        <p className="mt-5 max-w-lg font-cormorant text-xl italic leading-relaxed text-ink sm:text-2xl">{content.confession.sub}</p>

        <ConfessionButtons disabled={phase !== 'ask'} onYes={yes} onNo={() => setPhase('declined')} onToast={showToast} />
      </motion.div>

      {/* playful toast */}
      <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-5" aria-live="polite" role="status">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              className="glass rounded-full px-6 py-3 text-sm text-inkdeep"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* YES celebration */}
      <AnimatePresence>
        {phase === 'yes' && (
          <motion.div
            key="yes"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-blush/70 px-6 text-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            <HeartBurst reduced={reduced} />
            <motion.h2
              className="glow font-vibes text-5xl text-inkdeep sm:text-7xl"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.9, type: 'spring', damping: 14 }}
            >
              {content.confession.yesThanks}
            </motion.h2>
            <motion.p
              className="mt-4 font-cormorant text-2xl italic text-ink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
            >
              {content.confession.yesThanksSub}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* gentle decline: never pressured */}
      <AnimatePresence>
        {(phase === 'declined' || phase === 'farewell') && (
          <motion.div
            key="decline"
            role="dialog"
            aria-modal="true"
            aria-labelledby="decline-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-blush/80 px-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass max-w-md rounded-[2rem] p-8 text-center">
              {phase === 'declined' ? (
                <>
                  <h2 id="decline-title" className="font-playfair text-2xl text-inkdeep">
                    {content.confession.decline.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-ink">{content.confession.decline.body}</p>
                  <div className="mt-7 flex flex-col gap-3">
                    <button type="button" className="btn btn-primary" autoFocus onClick={() => setPhase('ask')}>
                      {content.confession.decline.back}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={leave}>
                      {content.confession.decline.leave}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 id="decline-title" className="font-vibes text-4xl text-inkdeep">
                    {content.confession.decline.farewell}
                  </h2>
                  <button type="button" className="btn btn-ghost mt-7" autoFocus onClick={() => setPhase('ask')}>
                    {content.confession.decline.backFromFarewell}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  );
}
