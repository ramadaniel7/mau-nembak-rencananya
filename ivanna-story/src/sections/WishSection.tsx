import { motion } from 'framer-motion';
import Stage from '../components/Stage';
import WishForm from '../components/WishForm';
import { content } from '../data/content';

interface Props {
  onHandoff: () => void;
  onFinish: () => void;
}

export default function WishSection({ onHandoff, onFinish }: Props) {
  return (
    <Stage>
      <motion.header
        className="mb-8 max-w-xl text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="font-vibes text-5xl text-inkdeep glow-soft sm:text-6xl">{content.wish.heading}</h1>
        <p className="mt-4 font-cormorant text-xl italic leading-relaxed text-ink sm:text-2xl">{content.wish.subtitle}</p>
      </motion.header>
      <WishForm onHandoff={onHandoff} onContinue={onFinish} />
    </Stage>
  );
}
