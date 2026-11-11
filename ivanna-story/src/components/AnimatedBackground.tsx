import { memo, useMemo, type CSSProperties, type Ref } from 'react';
import { config } from '../data/config';
import { rng } from '../utils/random';
import FloatingPetals from './FloatingPetals';
import Flower from './Flower';

export type BgVariant = 'dawn' | 'soft' | 'sky' | 'garden' | 'cinema';

const GRADIENTS: Record<BgVariant, string> = {
  dawn: 'linear-gradient(180deg, #FFF9F7 0%, #FCE4EC 48%, #F8C8D4 100%)',
  soft: 'linear-gradient(160deg, #FFF9F7 0%, #FCE4EC 55%, #E8DDF8 100%)',
  sky:
    'radial-gradient(circle at 82% 6%, rgba(255,238,196,0.85) 0%, rgba(255,238,196,0) 42%), linear-gradient(180deg, #E8DDF8 0%, #FCE4EC 42%, #FFF9F7 90%)',
  garden: 'linear-gradient(180deg, #FCE4EC 0%, #F8C8D4 62%, #F4A7B9 135%)',
  cinema: 'linear-gradient(180deg, #FCE4EC 0%, #F8C8D4 55%, #E8DDF8 125%)',
};
const VARIANTS = Object.keys(GRADIENTS) as BgVariant[];

interface Props {
  variant: BgVariant;
  hearts?: boolean;
  /** parallax layers for GSAP camera moves (cinematic scene) */
  farRef?: Ref<HTMLDivElement>;
  midRef?: Ref<HTMLDivElement>;
  nearRef?: Ref<HTMLDivElement>;
}

function AnimatedBackground({ variant, hearts = true, farRef, midRef, nearRef }: Props) {
  const deco = useMemo(() => {
    const r = rng(21);
    const small = typeof window !== 'undefined' && window.innerWidth < 640;
    const sparkleN = small ? Math.round(config.animation.sparkleCount * 0.6) : config.animation.sparkleCount;
    const sparkles = Array.from({ length: sparkleN }, (_, i) => ({
      id: i,
      left: r() * 100,
      top: r() * 100,
      size: 3 + r() * 5,
      dur: 2.6 + r() * 3.4,
      delay: -r() * 6,
      star: i % 4 === 0,
    }));
    const clouds = Array.from({ length: small ? 4 : 6 }, (_, i) => ({
      id: i,
      top: 6 + ((i * 17 + r() * 8) % 70),
      w: 200 + r() * 240,
      h: 46 + r() * 34,
      dur: 90 + r() * 90,
      delay: -r() * 150,
      left: r() * 100 - 20,
      op: 0.55 + r() * 0.35,
    }));
    const heartsList = Array.from({ length: config.animation.heartCount }, (_, i) => ({
      id: i,
      left: 5 + r() * 90,
      size: 14 + r() * 16,
      dur: 11 + r() * 8,
      delay: -r() * 18,
      drift: (r() - 0.5) * 18,
      rb: r() * 80,
    }));
    const flowers = Array.from({ length: small ? 7 : 12 }, (_, i) => ({
      id: i,
      left: (i / (small ? 6 : 11)) * 100 + (r() - 0.5) * 4,
      size: 44 + r() * 52,
      bottom: 8 + r() * 10,
      delay: -r() * 6,
      petal: [config.palette.rosePink, config.palette.softPink, '#ffffff', config.palette.lavender][i % 4],
    }));
    return { sparkles, clouds, heartsList, flowers };
  }, []);

  const showRays = variant === 'sky' || variant === 'cinema';
  const showGarden = variant === 'garden' || variant === 'cinema';

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {VARIANTS.map((v) => (
        <div
          key={v}
          className="absolute inset-0"
          style={{ background: GRADIENTS[v], opacity: v === variant ? 1 : 0, transition: 'opacity 1.4s ease' }}
        />
      ))}

      {/* FAR: light leaks, rays, stars */}
      <div ref={farRef} className="absolute" style={{ inset: '-12%', willChange: 'transform' }}>
        <span className="leak" style={{ left: '8%', top: '10%', width: '42vw', height: '42vw', background: 'rgb(244 167 185 / .55)', '--dur': '14s', '--delay': '0s' } as CSSProperties} />
        <span className="leak" style={{ right: '4%', top: '38%', width: '38vw', height: '38vw', background: 'rgb(232 221 248 / .75)', '--dur': '18s', '--delay': '-5s' } as CSSProperties} />
        <span className="leak" style={{ left: '28%', bottom: '2%', width: '34vw', height: '34vw', background: 'rgb(255 236 200 / .55)', '--dur': '16s', '--delay': '-9s' } as CSSProperties} />
        <div className="rays" style={{ opacity: showRays ? 0.9 : 0, transition: 'opacity 1.4s ease' }} />
        {deco.sparkles.map((s) =>
          s.star ? (
            <span
              key={s.id}
              className="sparkle-star"
              style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size * 2.6, '--dur': `${s.dur}s`, '--delay': `${s.delay}s` } as CSSProperties}
            >
              ✦
            </span>
          ) : (
            <span
              key={s.id}
              className="sparkle"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size * 2, height: s.size * 2, '--dur': `${s.dur}s`, '--delay': `${s.delay}s` } as CSSProperties}
            />
          ),
        )}
      </div>

      {/* MID: clouds */}
      <div ref={midRef} className="absolute" style={{ inset: '-12%', willChange: 'transform' }}>
        {deco.clouds.map((c) => (
          <div
            key={c.id}
            className="cloud"
            style={{ top: `${c.top}%`, width: c.w, height: c.h, opacity: c.op, '--dur': `${c.dur}s`, '--delay': `${c.delay}s`, '--left': `${c.left}vw` } as CSSProperties}
          />
        ))}
      </div>

      {/* NEAR: petals, hearts, flowers */}
      <div ref={nearRef} className="absolute" style={{ inset: '-12%', willChange: 'transform' }}>
        <FloatingPetals />
        {hearts &&
          deco.heartsList.map((h) => (
            <span
              key={h.id}
              className="heart-float"
              style={{ left: `${h.left}%`, fontSize: h.size, '--dur': `${h.dur}s`, '--delay': `${h.delay}s`, '--drift': `${h.drift}vw`, '--rb': `${h.rb}vh` } as CSSProperties}
            >
              ♥
            </span>
          ))}
        <div style={{ opacity: showGarden ? 1 : 0, transition: 'opacity 1.4s ease' }}>
          {deco.flowers.map((f) => (
            <Flower
              key={f.id}
              size={f.size}
              petal={f.petal}
              className="sway absolute"
              style={{ left: `${f.left}%`, bottom: `${f.bottom}%`, '--delay': `${f.delay}s` } as CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* soft vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgb(183 110 133 / 0.14) 100%)' }} />
    </div>
  );
}

export default memo(AnimatedBackground);
