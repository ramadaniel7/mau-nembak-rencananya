import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AnimatedBackground, { type BgVariant } from './components/AnimatedBackground';
import MusicController from './components/MusicController';
import WelcomeSection from './sections/WelcomeSection';
import LetterSection from './sections/LetterSection';
import BibleSection from './sections/BibleSection';
import ConfessionSection from './sections/ConfessionSection';
import WishSection from './sections/WishSection';
import ThankYouSection from './sections/ThankYouSection';
import { useExperience, type Stage } from './hooks/useExperience';
import { useAudio, type Scene } from './hooks/useAudio';

// GSAP is only needed for the cinematic scene: load it lazily.
const CinematicSection = lazy(() => import('./sections/CinematicSection'));

const BG: Record<Stage, BgVariant> = {
  welcome: 'dawn',
  letter: 'soft',
  verses: 'sky',
  confession: 'garden',
  cinematic: 'cinema',
  wish: 'soft',
  thanks: 'dawn',
};

const SCENE: Record<Stage, Scene> = {
  welcome: 'ambient',
  letter: 'ambient',
  verses: 'ambient',
  confession: 'ambient',
  cinematic: 'cinematic',
  wish: 'ambient',
  thanks: 'ambient',
};

export default function App() {
  const exp = useExperience();
  const audio = useAudio();
  const reduced = !!useReducedMotion();
  const { stage, runId, advance } = exp;

  useEffect(() => {
    audio.setScene(SCENE[stage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const view = (() => {
    switch (stage) {
      case 'welcome':
        return <WelcomeSection onBegin={() => void audio.start()} onFinish={() => advance('welcome')} />;
      case 'letter':
        return <LetterSection onFinish={() => advance('letter')} />;
      case 'verses':
        return <BibleSection onFinish={() => advance('verses')} />;
      case 'confession':
        return <ConfessionSection onAnswerYes={() => exp.setAnswer('yes')} onFinish={() => advance('confession')} />;
      case 'cinematic':
        return (
          <Suspense fallback={null}>
            <CinematicSection audio={audio} onFinish={() => advance('cinematic')} />
          </Suspense>
        );
      case 'wish':
        return <WishSection onHandoff={exp.markHandoff} onFinish={() => advance('wish')} />;
      case 'thanks':
        return <ThankYouSection onReplay={exp.replay} />;
    }
  })();

  return (
    <main className="fixed inset-0 overflow-hidden">
      {/* persistent dreamy background (the cinematic scene brings its own with parallax layers) */}
      <div style={{ opacity: stage === 'cinematic' ? 0 : 1, transition: 'opacity 0.9s ease' }}>
        <AnimatedBackground variant={BG[stage]} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${stage}-${runId}`}
          className="absolute inset-0"
          initial={reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(12px)', scale: 0.985 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(12px)', scale: 1.015 }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
        >
          {view}
        </motion.div>
      </AnimatePresence>

      <MusicController audio={audio} />
    </main>
  );
}
