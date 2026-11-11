import { Music, Pause } from 'lucide-react';
import type { AudioApi } from '../hooks/useAudio';

/** Always-visible play / pause control. The first press also starts the audio. */
export default function MusicController({ audio }: { audio: AudioApi }) {
  const on = audio.started && audio.playing;
  const label = on ? 'Pause music' : audio.started ? 'Resume music' : 'Play music';
  return (
    <button
      type="button"
      onClick={() => void audio.toggle()}
      aria-label={label}
      aria-pressed={on}
      title={label}
      className={`glass fixed z-50 flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:scale-105 ${
        on ? 'music-pulse' : ''
      }`}
      style={{ top: 'max(0.75rem, env(safe-area-inset-top))', right: 'max(0.75rem, env(safe-area-inset-right))' }}
    >
      {on ? <Pause size={18} aria-hidden="true" /> : <Music size={18} aria-hidden="true" />}
    </button>
  );
}
