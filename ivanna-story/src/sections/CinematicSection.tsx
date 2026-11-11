import CinematicLyrics from '../components/CinematicLyrics';
import type { AudioApi } from '../hooks/useAudio';

export default function CinematicSection({ audio, onFinish }: { audio: AudioApi; onFinish: () => void }) {
  return <CinematicLyrics audio={audio} onFinish={onFinish} />;
}
