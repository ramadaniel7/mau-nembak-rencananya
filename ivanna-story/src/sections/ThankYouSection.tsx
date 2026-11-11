import { motion, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import Stage from '../components/Stage';
import { config } from '../data/config';
import { content } from '../data/content';

export default function ThankYouSection({ onReplay }: { onReplay: () => void }) {
  const reduced = !!useReducedMotion();
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduced ? 0 : delay, duration: reduced ? 0.3 : 1.8, ease: 'easeOut' as const },
  });

  return (
    <Stage>
      <div className="flex max-w-xl flex-col items-center text-center">
        <motion.h1 className="glow font-vibes text-6xl text-inkdeep sm:text-8xl" {...fade(0.2)}>
          {content.thanks.title}
        </motion.h1>
        <motion.p className="mt-6 font-cormorant text-2xl italic leading-relaxed text-ink sm:text-3xl" {...fade(1.4)}>
          {content.thanks.body}
        </motion.p>
        <motion.p className="mt-6 font-vibes text-4xl text-rosetext" {...fade(2.6)}>
          {content.thanks.signoff}
        </motion.p>
        <motion.div className="mt-10" {...fade(3.6)}>
          <button type="button" className="btn btn-ghost" onClick={onReplay}>
            <RotateCcw size={16} aria-hidden="true" />
            {content.thanks.replay}
          </button>
          <p className="mt-6 font-poppins text-xs tracking-wider text-rosetext">{config.site.madeBy}</p>
        </motion.div>
      </div>
    </Stage>
  );
}
