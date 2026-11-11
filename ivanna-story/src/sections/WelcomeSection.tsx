import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Stage from '../components/Stage';
import { config } from '../data/config';
import { content } from '../data/content';

function TypedLines({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  const lines = content.welcome.lines;
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const fired = useRef(false);

  useEffect(() => {
    if (li >= lines.length) {
      if (!fired.current) {
        fired.current = true;
        doneRef.current();
      }
      return;
    }
    const line = lines[li];
    if (reduced) {
      const t = window.setTimeout(() => setLi((v) => v + 1), 900);
      return () => window.clearTimeout(t);
    }
    if (ci < line.text.length) {
      const t = window.setTimeout(() => setCi((v) => v + 1), config.animation.typingSpeedMs);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setLi((v) => v + 1);
      setCi(0);
    }, line.pause);
    return () => window.clearTimeout(t);
  }, [li, ci, lines, reduced]);

  return (
    <div className="space-y-4" aria-hidden="true">
      {lines.map((l, i) => {
        if (i > li) return null;
        const active = i === li && li < lines.length;
        const text = i < li || reduced ? l.text : l.text.slice(0, ci);
        return (
          <p
            key={i}
            className={`${i === 0 ? 'font-playfair text-4xl sm:text-6xl text-inkdeep' : 'font-cormorant text-2xl italic sm:text-3xl text-ink'} ${
              active && !reduced ? 'caret' : ''
            }`}
            style={{ opacity: i < li ? 0.6 : 1, transition: 'opacity 0.8s' }}
          >
            {text}
          </p>
        );
      })}
    </div>
  );
}

interface Props {
  /** called immediately on click (inside the user gesture) so audio may start */
  onBegin: () => void;
  /** called after the soft fade-out */
  onFinish: () => void;
}

export default function WelcomeSection({ onBegin, onFinish }: Props) {
  const reduced = !!useReducedMotion();
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const go = () => {
    if (leaving) return;
    setLeaving(true);
    onBegin();
    window.setTimeout(onFinish, reduced ? 100 : 1000);
  };

  return (
    <Stage>
      <motion.div
        className="flex max-w-2xl flex-col items-center gap-9 text-center"
        animate={leaving ? { opacity: 0, filter: 'blur(14px)', y: -12 } : { opacity: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <p className="font-vibes text-3xl text-rosetext glow-soft sm:text-4xl">{content.welcome.eyebrow}</p>

        <h1 className="sr-only">{content.welcome.lines.map((l) => l.text).join(' ')}</h1>
        <TypedLines reduced={reduced} onDone={() => setDone(true)} />

        <div className="min-h-[3.5rem]">
          <AnimatePresence>
            {done && (
              <motion.button
                type="button"
                onClick={go}
                className="btn btn-primary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {content.welcome.cta}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Stage>
  );
}
