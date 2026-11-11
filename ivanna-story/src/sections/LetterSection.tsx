import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Stage from '../components/Stage';
import Envelope from '../components/Envelope';
import Flower from '../components/Flower';
import { content } from '../data/content';

function Paragraph({ text, instant, onDone }: { text: string; instant: boolean; onDone: () => void }) {
  const words = text.split(' ');
  return (
    <p className="font-cormorant text-[1.2rem] leading-[34px] text-ink sm:text-[1.35rem]">
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: '0.28em' }}
          initial={{ opacity: 0, y: 6, filter: instant ? 'blur(0px)' : 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: instant ? 0 : i * 0.06, duration: instant ? 0.15 : 0.5 }}
          onAnimationComplete={i === words.length - 1 ? onDone : undefined}
        >
          {w}
        </motion.span>
      ))}
    </p>
  );
}

function LetterCard({ onContinue }: { onContinue: () => void }) {
  const reduced = !!useReducedMotion();
  const paragraphs = content.letter.paragraphs;
  const [shown, setShown] = useState(1);
  const [all, setAll] = useState(reduced);
  const [finished, setFinished] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // keep the newest text in view while it types out
  useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => {
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
    }, 350);
    return () => window.clearInterval(id);
  }, [finished]);

  const revealAll = () => {
    setAll(true);
    setShown(paragraphs.length);
    setFinished(true);
  };

  return (
    <motion.div
      className="paper relative mx-auto w-full max-w-xl rounded-2xl"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <Flower size={50} className="absolute -left-4 -top-4 z-10" />
      <Flower size={36} petal="#ffffff" className="absolute -right-3 -top-3 z-10" />
      <div className="absolute -top-2 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-rosepink/70" aria-hidden="true" />

      <div ref={scroller} className="max-h-[68dvh] overflow-y-auto px-6 pb-6 pt-9 sm:px-10">
        <h2 className="mb-4 font-vibes text-4xl text-rosetext">{content.letter.greeting}</h2>
        <div className="space-y-[34px]">
          {paragraphs.slice(0, shown).map((p, i) => (
            <Paragraph
              key={`${i}-${all}`}
              text={p}
              instant={all}
              onDone={() => {
                if (i === paragraphs.length - 1) setFinished(true);
                else window.setTimeout(() => setShown((s) => Math.max(s, i + 2)), reduced ? 100 : 450);
              }}
            />
          ))}
        </div>

        <AnimatePresence>
          {finished && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mt-8">
              <p className="text-right font-vibes text-3xl text-rosetext">— {content.letter.signoff}</p>
              <p className="mt-6 text-center font-vibes text-3xl text-inkdeep glow-soft sm:text-4xl">{content.letter.closing}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-rosepink/30 px-6 py-4">
        {finished ? (
          <motion.button type="button" className="btn btn-primary" onClick={onContinue} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {content.letter.cta}
          </motion.button>
        ) : (
          <button type="button" className="btn btn-ghost !min-h-0 !py-2 text-xs" onClick={revealAll}>
            {content.letter.showAll}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function LetterSection({ onFinish }: { onFinish: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Stage>
      <h1 className="sr-only">{content.letter.title}</h1>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="env"
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
          >
            <Envelope onOpened={() => setOpen(true)} />
          </motion.div>
        ) : (
          <LetterCard key="letter" onContinue={onFinish} />
        )}
      </AnimatePresence>
    </Stage>
  );
}
