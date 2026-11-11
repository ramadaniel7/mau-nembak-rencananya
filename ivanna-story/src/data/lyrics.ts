import { config } from './config';

/**
 * ORIGINAL song lyrics written for this story (not taken from any existing song).
 * Edit the lines / durations below; timings are computed automatically.
 *
 * Structure: Intro, Verse 1, Pre-Chorus, Chorus, Verse 2, Bridge, Final Chorus, Outro, Final message.
 */

export type CueStyle = 'intro' | 'verse' | 'pre' | 'chorus' | 'bridge' | 'outro' | 'final';

export interface Camera {
  scale: number;
  /** percent of viewport width */
  x: number;
  /** percent of viewport height */
  y: number;
}

export interface Cue {
  id: number;
  t: number;
  dur: number;
  style: CueStyle;
  section: string;
  text: string;
  emphasis?: boolean;
  camera: Camera;
}

interface LineSpec {
  text: string;
  dur?: number;
  emphasis?: boolean;
}

interface SectionSpec {
  name: string;
  style: CueStyle;
  dur: number; // default seconds per line
  gap?: number; // seconds between lines
  after?: number; // extra silence after the section
  lines: Array<string | LineSpec>;
}

const { firstName } = config.recipient;
const [, miaa, mikuuu, yemiaa] = config.recipient.nicknames;

const CHORUS_CORE = [
  `Oh, ${miaa}, you're my softest kind of light,`,
  'pink skies bloom whenever you smile.',
  'Let me hold this moment a little while,',
  'and make beautiful memories with you.',
];

const SECTIONS: SectionSpec[] = [
  {
    name: 'Intro',
    style: 'intro',
    dur: 4.6,
    after: 1,
    lines: [
      'Somewhere between the stars and the sky...',
      'I found a little reason to smile...',
      'And maybe, just maybe...',
      { text: 'That reason has your name.', dur: 5.2 },
    ],
  },
  {
    name: 'Verse 1',
    style: 'verse',
    dur: 4.6,
    after: 0.8,
    lines: [
      'Quiet nights, and my phone lights up,',
      `your name on the screen, and I'm undone.`,
      'I never planned to feel this way,',
      'but you walked in like a soft sunrise.',
      'Now every ordinary hour',
      'feels a little more like home.',
    ],
  },
  {
    name: 'Pre-Chorus',
    style: 'pre',
    dur: 4.4,
    after: 0.8,
    lines: [
      "And I don't know what tomorrow brings,",
      'but I know that I want to stay,',
      { text: 'just one more minute, just one more day.', dur: 5 },
    ],
  },
  {
    name: 'Chorus',
    style: 'chorus',
    dur: 4.8,
    after: 1.2,
    lines: CHORUS_CORE,
  },
  {
    name: 'Verse 2',
    style: 'verse',
    dur: 4.6,
    after: 0.8,
    lines: [
      'Small talks turn into hours,',
      `hours turn into "I miss you,"`,
      "and I'm quietly learning all your favorite things.",
      'Pelan-pelan saja, aku di sini,',
      'hoping you will hold my heart so kindly.',
    ],
  },
  {
    name: 'Bridge',
    style: 'bridge',
    dur: 6,
    after: 1,
    lines: [
      'If love is a garden, let me plant it slow,',
      'water it with laughter, and watch it grow,',
      `${yemiaa}, maybe this is where our story starts.`,
    ],
  },
  {
    name: 'Final Chorus',
    style: 'chorus',
    dur: 4.8,
    after: 1.2,
    lines: [
      `Oh, ${firstName}, you're my softest kind of light,`,
      'pink skies bloom whenever you smile.',
      'Let me hold this moment a little while,',
      'and make beautiful memories with you.',
      `Oh, ${mikuuu}, take your time, take my hand,`,
      { text: "I'd choose this little story every time.", dur: 5.6 },
    ],
  },
  {
    name: 'Outro',
    style: 'outro',
    dur: 5,
    after: 1.5,
    lines: [
      'Pelan-pelan saja... aku di sini.',
      'Somewhere between the stars and the sky,',
      { text: 'I found you.', dur: 5.5 },
    ],
  },
  {
    name: 'Finale',
    style: 'final',
    dur: 6.4,
    gap: 2.2,
    lines: [
      'And if I could choose one beautiful story to begin...',
      { text: `It would be a story with you, ${firstName}.`, dur: 6.2, emphasis: true },
      'Thank you for making this little world feel special.',
    ],
  },
];

function cameraFor(style: CueStyle, i: number): Camera {
  const dir = i % 2 === 0 ? 1 : -1;
  switch (style) {
    case 'intro':
      return { scale: 1.06, x: 0, y: 0 };
    case 'verse':
      return { scale: 1.09, x: 2.6 * dir, y: 0 };
    case 'pre':
      return { scale: 1.15, x: 0, y: -1.5 };
    case 'chorus':
      return { scale: 1.22, x: 1.2 * dir, y: 0 };
    case 'bridge':
      return { scale: 1.1, x: 5 * dir, y: 1 };
    case 'outro':
      return { scale: 1.0, x: 0, y: 0 };
    case 'final':
    default:
      return { scale: 1.04, x: 0, y: -0.5 };
  }
}

function build(): Cue[] {
  const cues: Cue[] = [];
  let cursor = 1.0;
  let id = 0;
  for (const s of SECTIONS) {
    const gap = s.gap ?? 0.5;
    s.lines.forEach((l, i) => {
      const spec: LineSpec = typeof l === 'string' ? { text: l } : l;
      const dur = spec.dur ?? s.dur;
      cues.push({
        id: id++,
        t: cursor,
        dur,
        style: s.style,
        section: s.name,
        text: spec.text,
        emphasis: spec.emphasis,
        camera: cameraFor(s.style, i),
      });
      cursor += dur + gap;
    });
    cursor += s.after ?? 1.2;
  }
  return cues;
}

export const CUES: Cue[] = build();
export const TOTAL_DURATION: number = CUES[CUES.length - 1].t + CUES[CUES.length - 1].dur;
