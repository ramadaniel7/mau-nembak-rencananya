import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Stage from '../components/Stage';
import BibleVerse from '../components/BibleVerse';
import { VERSES } from '../data/verses';
import { content } from '../data/content';

export default function BibleSection({ onFinish }: { onFinish: () => void }) {
  const reduced = !!useReducedMotion();
  const total = VERSES.length;
  const [i, setI] = useState(0);
  const closing = i >= total;

  return (
    <Stage>
      <h1 className="mb-6 text-center font-vibes text-4xl text-rosetext glow-soft sm:text-5xl">{content.verses.title}</h1>

      <AnimatePresence mode="wait">
        {!closing ? (
          <BibleVerse key={i} verse={VERSES[i]} index={i} total={total} />
        ) : (
          <motion.div
            key="closing"
            className="glass mx-auto max-w-xl rounded-[2rem] px-7 py-12 text-center"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="font-cormorant text-2xl italic leading-relaxed text-inkdeep sm:text-3xl">{content.verses.closing}</p>
            <button type="button" className="btn btn-primary mt-8" onClick={onFinish}>
              {content.verses.cta}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="mt-7 flex items-center gap-4" aria-label="Verse navigation">
        <button
          type="button"
          className="btn btn-ghost !min-h-0 !px-3 !py-2"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          aria-label={content.verses.back}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <ol className="flex items-center gap-2" aria-label="Progress">
          {VERSES.map((_, k) => (
            <li
              key={k}
              aria-current={k === i ? 'step' : undefined}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: k === i ? 28 : 8,
                background: k <= i || closing ? 'rgb(var(--c-rose-text))' : 'rgb(var(--c-rose) / 0.6)',
              }}
            />
          ))}
        </ol>

        {!closing && (
          <button type="button" className="btn btn-primary !min-h-0 !py-2" onClick={() => setI((v) => v + 1)}>
            {i === total - 1 ? 'Continue' : content.verses.next}
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        )}
        {closing && (
          <button type="button" className="btn btn-ghost !min-h-0 !py-2" onClick={() => setI(total - 1)}>
            {content.verses.back}
          </button>
        )}
      </nav>
    </Stage>
  );
}
