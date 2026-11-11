import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Flower from './Flower';
import { content } from '../data/content';

/** Floating envelope. Clicking (or Enter / Space) opens the flap, lifts the letter and calls onOpened. */
export default function Envelope({ onOpened }: { onOpened: () => void }) {
  const reduced = !!useReducedMotion();
  const [phase, setPhase] = useState<'closed' | 'opening'>('closed');
  const timer = useRef<number | null>(null);

  const open = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    timer.current = window.setTimeout(onOpened, reduced ? 150 : 1700);
  };
  const opening = phase === 'opening';

  return (
    <div className="flex flex-col items-center gap-8">
      <button
        type="button"
        onClick={open}
        aria-label="Open the envelope"
        className={`relative ${reduced ? '' : 'bob'} aspect-[4/3] w-[min(78vw,340px)] rounded-xl`}
        style={{ perspective: 900 }}
      >
        {/* decorative flowers */}
        <Flower size={54} className="absolute -left-5 -top-5 z-50 drop-shadow" />
        <Flower size={38} petal="#ffffff" className="absolute -right-3 -top-4 z-50 drop-shadow" />
        <Flower size={44} petal="#E8DDF8" className="absolute -bottom-4 -right-5 z-50 drop-shadow" />

        {/* back */}
        <div className="absolute inset-0 rounded-xl" style={{ background: '#F8C8D4', boxShadow: '0 30px 60px -24px rgb(183 110 133 / .7)' }} />

        {/* letter peeking out */}
        <motion.div
          className="paper absolute left-[7%] right-[7%] top-[8%] bottom-[10%] rounded-md"
          style={{ zIndex: 10 }}
          animate={opening ? { y: '-62%' } : { y: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.9, delay: opening && !reduced ? 0.55 : 0, ease: 'easeOut' }}
        >
          <div className="mt-6 space-y-2 px-4 opacity-60">
            <div className="h-1.5 w-3/4 rounded bg-rosepink/60" />
            <div className="h-1.5 w-1/2 rounded bg-rosepink/60" />
          </div>
        </motion.div>

        {/* front pocket */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 20,
            background: 'linear-gradient(160deg, #FCE4EC, #F8C8D4)',
            clipPath: 'polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)',
            borderRadius: 12,
          }}
        />

        {/* ribbon */}
        <div
          className="absolute left-0 right-0"
          style={{ zIndex: 22, bottom: '22%', height: 10, background: 'linear-gradient(90deg,#F4A7B9,#fff3,#F4A7B9)', opacity: 0.85 }}
        />

        {/* flap */}
        <motion.div
          className="absolute left-0 right-0 top-0"
          style={{
            height: '54%',
            transformOrigin: 'top',
            background: 'linear-gradient(180deg, #F4A7B9, #F8C8D4)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
          animate={opening ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
          transition={{ duration: reduced ? 0.1 : 0.7, ease: 'easeInOut', zIndex: { duration: 0, delay: opening ? 0.35 : 0 } }}
        />

        {/* wax-heart seal */}
        <motion.div
          className="absolute left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-lg text-cream"
          style={{ top: '40%', zIndex: 40, background: 'radial-gradient(circle at 35% 30%, #D98CA5, #B76E85)', boxShadow: '0 6px 14px -4px rgb(120 50 80 / .6)' }}
          animate={opening ? { opacity: 0, scale: 0.4 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          ♥
        </motion.div>
      </button>

      <p className="font-vibes text-3xl text-rosetext glow-soft" aria-live="polite">
        {opening ? '♡' : content.letter.hint}
      </p>
    </div>
  );
}
