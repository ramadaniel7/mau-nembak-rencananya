import { motion, useReducedMotion } from 'framer-motion';
import { BIBLE_TRANSLATION, type Verse } from '../data/verses';

interface Props {
  verse: Verse;
  index: number;
  total: number;
}

export default function BibleVerse({ verse, index, total }: Props) {
  const reduced = !!useReducedMotion();
  return (
    <motion.article
      className="glass mx-auto w-full max-w-2xl rounded-[2rem] px-6 py-9 text-center sm:px-12 sm:py-12"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(10px)' }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -18, filter: 'blur(8px)' }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      aria-label={`Verse ${index + 1} of ${total}: ${verse.reference}`}
    >
      <p className="font-poppins text-[0.7rem] uppercase tracking-[0.35em] text-rosetext">{verse.theme}</p>
      <h2 className="mt-2 font-playfair text-2xl text-inkdeep sm:text-3xl">
        {verse.reference}
      </h2>
      <div className="mx-auto my-5 h-px w-16 bg-rosepink" />
      <blockquote className="font-cormorant text-[1.35rem] italic leading-relaxed text-ink sm:text-[1.65rem]">
        “{verse.text}”
      </blockquote>
      <p className="mt-2 font-poppins text-[0.68rem] tracking-wider text-rosetext">{BIBLE_TRANSLATION}</p>
      <p className="mx-auto mt-6 max-w-md font-poppins text-sm font-light leading-relaxed text-ink">
        <span className="font-vibes text-2xl text-rosetext">♡ </span>
        {verse.reflection}
      </p>
    </motion.article>
  );
}
