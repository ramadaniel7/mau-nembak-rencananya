import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type MotionProps } from 'framer-motion';
import gsap from 'gsap';
import AnimatedBackground from './AnimatedBackground';
import { CUES, TOTAL_DURATION, type Cue } from '../data/lyrics';
import { config } from '../data/config';
import { content } from '../data/content';
import type { AudioApi } from '../hooks/useAudio';

interface Props {
  audio: AudioApi;
  onFinish: () => void;
}

/* ------------------------------------------------------------------ */
/*  One lyric on screen — a different composition per section style    */
/* ------------------------------------------------------------------ */

function motionFor(reduced: boolean, spacing: string, blur: number, hold = 1.6): MotionProps {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.6 } },
      exit: { opacity: 0, transition: { duration: 0.6 } },
    };
  }
  return {
    initial: { opacity: 0, filter: `blur(${blur}px)`, letterSpacing: spacing, scale: 0.97 },
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      letterSpacing: '0.02em',
      scale: 1,
      transition: { duration: hold, ease: 'easeOut' },
    },
    exit: { opacity: 0, filter: 'blur(10px)', scale: 1.04, transition: { duration: 0.9, ease: 'easeIn' } },
  };
}

function Words({ text, reduced, step = 0.12 }: { text: string; reduced: boolean; step?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block"
          style={{ marginRight: '0.28em' }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(8px)', letterSpacing: '0.3em' }}
          animate={
            reduced
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.01em' }
          }
          transition={{ delay: reduced ? 0 : 0.25 + i * step, duration: reduced ? 0.4 : 1.1, ease: 'easeOut' }}
        >
          {w}
        </motion.span>
      ))}
    </>
  );
}

const CueView = memo(function CueView({ cue, reduced }: { cue: Cue; reduced: boolean }) {
  const base = 'absolute inset-0 flex px-6 text-center text-inkdeep';

  switch (cue.style) {
    case 'intro':
      return (
        <motion.div className={`${base} items-center justify-center`} {...motionFor(reduced, '0.35em', 12)}>
          <p className="glow-soft max-w-xl font-cormorant text-2xl italic sm:text-4xl">{cue.text}</p>
        </motion.div>
      );

    case 'verse':
      return (
        <motion.div
          className={`${base} items-end justify-center pb-[22vh] sm:pb-[20vh]`}
          {...motionFor(reduced, '0.25em', 10)}
        >
          <p className="glow-soft max-w-2xl font-cormorant text-[1.7rem] italic leading-snug sm:text-4xl">{cue.text}</p>
        </motion.div>
      );

    case 'pre':
      return (
        <motion.div
          className={`${base} items-start justify-center pt-[24vh]`}
          {...motionFor(reduced, '0.3em', 14, 2)}
        >
          <p className="glow-soft max-w-2xl font-playfair text-xl leading-relaxed sm:text-3xl">{cue.text}</p>
        </motion.div>
      );

    case 'chorus':
      return (
        <motion.div
          className={`${base} items-center justify-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, filter: reduced ? undefined : 'blur(12px)', scale: reduced ? 1 : 1.06, transition: { duration: 0.9 } }}
        >
          <p className="glow max-w-3xl font-playfair text-[2.1rem] leading-[1.2] sm:text-6xl">
            <Words text={cue.text} reduced={reduced} />
          </p>
        </motion.div>
      );

    case 'bridge': {
      const words = cue.text.split(' ');
      return (
        <motion.div
          className={`${base} items-center justify-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6 } }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          <div className="flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-5 sm:gap-x-9 sm:gap-y-8">
            {words.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                className="glow font-cormorant text-[1.7rem] italic sm:text-5xl"
                style={{ marginTop: ((i % 3) - 1) * 16 }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, filter: 'blur(0px)', y: [0, -12, 0] }
                }
                transition={{
                  opacity: { delay: i * 0.28, duration: 1.2 },
                  scale: { delay: i * 0.28, duration: 1.2 },
                  filter: { delay: i * 0.28, duration: 1.2 },
                  y: { delay: i * 0.28, duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                {w}
              </motion.span>
            ))}
          </div>
        </motion.div>
      );
    }

    case 'outro':
      return (
        <motion.div className={`${base} items-center justify-center`} {...motionFor(reduced, '0.2em', 16, 2.2)}>
          <p className="glow max-w-2xl font-vibes text-[2.6rem] leading-tight sm:text-7xl">{cue.text}</p>
        </motion.div>
      );

    case 'final':
    default:
      return (
        <motion.div
          className={`${base} items-center justify-center`}
          initial={{ opacity: 0, filter: reduced ? undefined : 'blur(14px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 2, ease: 'easeOut' } }}
          exit={{ opacity: 0, filter: reduced ? undefined : 'blur(10px)', transition: { duration: 1.4 } }}
        >
          <p
            className={`glow max-w-3xl leading-tight ${
              cue.emphasis
                ? 'font-vibes text-[2.8rem] sm:text-7xl'
                : 'font-playfair text-[1.8rem] sm:text-5xl'
            }`}
          >
            {cue.text}
          </p>
        </motion.div>
      );
  }
});

/* ------------------------------------------------------------------ */
/*  The film: clock + GSAP camera + parallax layers                     */
/* ------------------------------------------------------------------ */

export default function CinematicLyrics({ audio, onFinish }: Props) {
  const reduced = !!useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(-1);

  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const timeRef = useRef(-config.music.lyricsOffsetSec);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  // audio scene + sync clock
  useEffect(() => {
    audio.setScene('cinematic');
    audio.restartTrack();
    audio.registerClock(() => timeRef.current);
    return () => audio.registerClock(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // master clock: works with or without audio
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let current = -1;
    let finished = false;

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!document.hidden) timeRef.current += dt;
      const t = timeRef.current;

      let idx = -1;
      for (let i = 0; i < CUES.length; i++) {
        if (t >= CUES[i].t && t < CUES[i].t + CUES[i].dur) {
          idx = i;
          break;
        }
      }
      if (idx !== current) {
        current = idx;
        setActiveIdx(idx);
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(0, Math.min(1, t / TOTAL_DURATION))})`;
      }
      if (!finished && t >= TOTAL_DURATION + 2.2) {
        finished = true;
        finishRef.current();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // cinematic camera: slow zooms, pans, parallax (disabled for reduced motion)
  useEffect(() => {
    if (reduced) return;
    const cue = activeIdx >= 0 ? CUES[activeIdx] : null;
    const cam = cue ? cue.camera : { scale: 1, x: 0, y: 0 };
    const d = cue ? cue.dur + 1.4 : 2.4;
    const ease = 'sine.inOut';
    if (camRef.current) gsap.to(camRef.current, { scale: cam.scale, xPercent: cam.x, yPercent: cam.y, duration: d, ease, overwrite: 'auto' });
    if (farRef.current) gsap.to(farRef.current, { scale: 1 + (cam.scale - 1) * 0.35, xPercent: cam.x * 0.4, yPercent: cam.y * 0.4, duration: d, ease, overwrite: 'auto' });
    if (midRef.current) gsap.to(midRef.current, { scale: 1 + (cam.scale - 1) * 0.8, xPercent: cam.x * 0.9, yPercent: cam.y * 0.9, duration: d, ease, overwrite: 'auto' });
    if (nearRef.current) gsap.to(nearRef.current, { scale: 1 + (cam.scale - 1) * 1.5, xPercent: cam.x * 1.6, yPercent: cam.y * 1.6, duration: d, ease, overwrite: 'auto' });
  }, [activeIdx, reduced]);

  useEffect(
    () => () => {
      gsap.killTweensOf([camRef.current, farRef.current, midRef.current, nearRef.current]);
    },
    [],
  );

  const cue = activeIdx >= 0 ? CUES[activeIdx] : null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatedBackground variant="cinema" farRef={farRef} midRef={midRef} nearRef={nearRef} />

      {/* camera layer carrying the lyrics */}
      <div ref={camRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        <AnimatePresence>{cue && <CueView key={cue.id} cue={cue} reduced={reduced} />}</AnimatePresence>
      </div>

      {/* live caption for screen readers */}
      <p className="sr-only" aria-live="polite">
        {cue?.text ?? ''}
      </p>

      {/* progress */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-white/40">
        <div ref={barRef} className="h-full origin-left bg-rosepink" style={{ transform: 'scaleX(0)' }} />
      </div>

      <button
        type="button"
        onClick={() => finishRef.current()}
        className="btn btn-ghost absolute bottom-5 left-1/2 z-40 -translate-x-1/2 !min-h-0 !px-5 !py-2 text-xs"
        style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        {content.cinematic.skip} ›
      </button>
    </div>
  );
}
