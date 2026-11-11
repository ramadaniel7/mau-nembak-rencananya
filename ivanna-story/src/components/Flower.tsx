import { memo, type CSSProperties } from 'react';
import { config } from '../data/config';

interface Props {
  size?: number;
  petal?: string;
  center?: string;
  className?: string;
  style?: CSSProperties;
}

/** Delicate five-petal flower used as a decoration. */
function Flower({ size = 48, petal = config.palette.rosePink, center = '#FFE9B8', className, style }: Props) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-22" rx="13" ry="24" fill={petal} opacity="0.92" transform={`rotate(${a})`} />
      ))}
      {[36, 108, 180, 252, 324].map((a) => (
        <ellipse key={a} cx="0" cy="-16" rx="7" ry="14" fill="#fff" opacity="0.35" transform={`rotate(${a})`} />
      ))}
      <circle r="9" fill={center} />
      <circle r="4" fill="#fff" opacity="0.6" />
    </svg>
  );
}

export default memo(Flower);
