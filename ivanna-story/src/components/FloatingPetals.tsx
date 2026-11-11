import { memo, useMemo, type CSSProperties } from 'react';
import { config } from '../data/config';
import { rng } from '../utils/random';

const COLORS = ['petal-rose', 'petal-soft', 'petal-white', 'petal-lav'];

function FloatingPetals({ count }: { count?: number }) {
  const n = count ?? config.animation.petalCount;
  const items = useMemo(() => {
    const r = rng(7);
    const small = typeof window !== 'undefined' && window.innerWidth < 640;
    const total = small ? Math.round(n * 0.65) : n;
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      left: r() * 100,
      size: 10 + r() * 14,
      dur: 12 + r() * 10,
      delay: -r() * 22,
      drift: (r() - 0.5) * 36,
      spin: 200 + r() * 360,
      rt: r() * 90,
      color: COLORS[i % COLORS.length],
      blur: i % 5 === 0 ? 1.5 : 0,
    }));
  }, [n]);

  return (
    <>
      {items.map((p) => (
        <span
          key={p.id}
          className={`petal ${p.color}`}
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.2,
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--drift': `${p.drift}vw`,
              '--spin': `${p.spin}deg`,
              '--rt': `${p.rt}vh`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

export default memo(FloatingPetals);
