import { useSyncExternalStore } from 'react';
import { config } from '../data/config';

/**
 * Audio engine.
 *  - If config.music.src is set and loads, that file is used.
 *  - Otherwise an ORIGINAL instrumental is synthesised live with the Web Audio API
 *    (soft piano, music-box, dreamy pads, gentle strings in the cinematic scene).
 *  - If neither is possible (or autoplay is blocked) the experience still runs silently.
 */

export type Scene = 'off' | 'ambient' | 'cinematic';
type Mode = 'file' | 'synth' | 'none';

export interface AudioSnapshot {
  started: boolean;
  playing: boolean;
  mode: Mode;
}

const BPM = 66;
const BEAT = 60 / BPM;
const SYNTH_GAIN = 2.4;
const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Cmaj7 – Am7 – Fmaj7 – Gadd9 (root, third, fifth, seventh/ninth)
const CHORDS: number[][] = [
  [48, 52, 55, 59],
  [45, 48, 52, 55],
  [41, 45, 48, 52],
  [43, 47, 50, 57],
];

interface ToneOpts {
  type: OscillatorType;
  gain: number;
  attack?: number;
  release?: number;
  pluck?: boolean;
}

class Engine {
  private snap: AudioSnapshot = { started: false, playing: false, mode: 'none' };
  private listeners = new Set<() => void>();

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private el: HTMLAudioElement | null = null;
  private pumpTimer: number | null = null;
  private fadeTimer: number | null = null;
  private nextBar = 0;
  private bar = 0;

  private scene: Scene = 'off';
  private level = 0;
  private userPaused = false;
  private autoPaused = false;
  private clock: (() => number) | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!this.snap.started) return;
        if (document.hidden) {
          if (this.snap.playing) {
            this.autoPaused = true;
            this.suspendNow();
          }
        } else if (this.autoPaused && !this.userPaused) {
          this.autoPaused = false;
          void this.resumeNow();
        }
      });
    }
  }

  /* ---------- store plumbing ---------- */
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  getSnapshot = () => this.snap;
  private set(p: Partial<AudioSnapshot>) {
    this.snap = { ...this.snap, ...p };
    this.listeners.forEach((l) => l());
  }

  /* ---------- public API ---------- */

  /** Must be called from a user gesture (click / tap). Safe to call repeatedly. */
  start = async (): Promise<void> => {
    if (this.snap.started) return;
    this.set({ started: true });
    if (config.music.src) {
      const ok = await this.startFile();
      if (ok) return;
    }
    await this.startSynth();
  };

  toggle = async (): Promise<void> => {
    if (!this.snap.started) {
      await this.start();
      return;
    }
    if (this.snap.playing) {
      this.userPaused = true;
      this.fadeTo(0, 350);
      window.setTimeout(() => {
        if (this.userPaused) this.suspendNow();
      }, 380);
      this.set({ playing: false });
    } else {
      this.userPaused = false;
      this.autoPaused = false;
      await this.resumeNow();
    }
  };

  setScene = (scene: Scene): void => {
    this.scene = scene;
    if (this.snap.started && this.snap.playing && !this.userPaused) {
      this.fadeTo(this.targetLevel(), config.music.fadeMs);
    }
  };

  /** Cinematic scene calls this so a user-supplied file restarts at the beginning of the film. */
  restartTrack = (): void => {
    if (this.el) {
      try {
        this.el.currentTime = 0;
        if (this.el.paused && !this.userPaused) void this.el.play().catch(() => undefined);
      } catch {
        /* ignore */
      }
    }
  };

  /** Film clock (seconds, can be negative before the lyrics start) so resume can re-sync a file. */
  registerClock = (fn: (() => number) | null): void => {
    this.clock = fn;
  };

  /* ---------- internals ---------- */

  private targetLevel(): number {
    if (this.scene === 'cinematic') return config.music.volume.cinematic;
    if (this.scene === 'ambient') return config.music.volume.ambient;
    return 0;
  }

  private setLevel(v: number) {
    this.level = v;
    if (this.el) this.el.volume = Math.max(0, Math.min(1, v));
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(v * SYNTH_GAIN, this.ctx.currentTime, 0.03);
    }
  }

  private fadeTo(target: number, ms: number) {
    if (this.fadeTimer) window.clearInterval(this.fadeTimer);
    const from = this.level;
    const t0 = performance.now();
    this.fadeTimer = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / Math.max(1, ms));
      this.setLevel(from + (target - from) * k);
      if (k >= 1 && this.fadeTimer) {
        window.clearInterval(this.fadeTimer);
        this.fadeTimer = null;
      }
    }, 30);
  }

  private startFile(): Promise<boolean> {
    return new Promise((resolve) => {
      const el = new Audio();
      el.preload = 'auto';
      el.loop = true;
      el.volume = 0;
      el.src = config.music.src;
      el.addEventListener('error', () => resolve(false), { once: true });
      el.play()
        .then(() => {
          this.el = el;
          this.set({ mode: 'file', playing: true });
          this.fadeTo(this.targetLevel(), config.music.fadeMs);
          resolve(true);
        })
        .catch(() => resolve(false));
    });
  }

  private async startSynth(): Promise<void> {
    const AC: typeof AudioContext | undefined =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) {
      this.set({ mode: 'none', playing: false });
      return;
    }
    try {
      const ctx = new AC();
      this.ctx = ctx;

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      this.master = master;

      const bus = ctx.createGain();
      const dry = ctx.createGain();
      dry.gain.value = 0.75;
      const wet = ctx.createGain();
      wet.gain.value = 0.55;
      const conv = ctx.createConvolver();
      conv.buffer = this.impulse(ctx, 3.2);
      bus.connect(dry).connect(master);
      bus.connect(conv).connect(wet).connect(master);
      this.bus = bus;

      await ctx.resume();
      this.bar = 0;
      this.nextBar = ctx.currentTime + 0.2;
      this.pumpTimer = window.setInterval(() => this.pump(), 200);
      this.pump();
      this.set({ mode: 'synth', playing: true });
      this.fadeTo(this.targetLevel(), config.music.fadeMs);
    } catch {
      this.set({ mode: 'none', playing: false });
    }
  }

  private impulse(ctx: AudioContext, seconds: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }

  private pump() {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextBar < ctx.currentTime + 1.2) {
      this.scheduleBar(this.bar % CHORDS.length, this.nextBar);
      this.nextBar += 4 * BEAT;
      this.bar++;
    }
  }

  private tone(freq: number, t: number, dur: number, o: ToneOpts) {
    const ctx = this.ctx;
    if (!ctx || !this.bus) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = o.type;
    osc.frequency.value = freq;
    const a = o.attack ?? 0.01;
    const end = t + dur;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(o.gain, t + a);
    if (o.pluck) {
      g.gain.exponentialRampToValueAtTime(0.0001, end);
    } else {
      const r = o.release ?? 0.8;
      g.gain.setValueAtTime(o.gain, Math.max(t + a, end - r));
      g.gain.linearRampToValueAtTime(0.0001, end);
    }
    osc.connect(g).connect(this.bus);
    osc.start(t);
    osc.stop(end + 0.05);
  }

  private scheduleBar(i: number, t: number) {
    const chord = CHORDS[i];
    const big = this.scene === 'cinematic';
    const barLen = 4 * BEAT;

    // dreamy pad (triad + 7th, one octave up)
    chord.slice(1).forEach((n) => {
      this.tone(midi(n + 12), t, barLen + 1.6, { type: 'sine', gain: 0.03, attack: 1.4, release: 1.6 });
      this.tone(midi(n + 12) * 1.004, t, barLen + 1.6, { type: 'triangle', gain: 0.01, attack: 1.6, release: 1.6 });
    });

    // gentle strings swell in the cinematic scene
    if (big) {
      chord.forEach((n) =>
        this.tone(midi(n + 24) * 0.998, t, barLen + 1.2, { type: 'sawtooth', gain: 0.0045, attack: 1.8, release: 1.4 }),
      );
    }

    // soft bass
    this.tone(midi(chord[0] - 12), t, barLen, { type: 'sine', gain: 0.08, attack: 0.06, release: 1.2 });

    // soft piano: rolled chord on beat 1 (and beat 3 in the cinematic scene)
    const roll = (at: number) =>
      chord.forEach((n, k) =>
        this.tone(midi(n + 12), at + k * 0.05, 2.8, { type: 'triangle', gain: 0.045, attack: 0.012, pluck: true }),
      );
    roll(t);
    if (big) roll(t + 2 * BEAT);

    // music-box arpeggio
    const pattern = big ? [0, 1, 2, 3, 2, 1, 2, 3] : [0, 2, 1, 3];
    const step = big ? BEAT / 2 : BEAT;
    const offset = big ? 0 : BEAT / 2;
    pattern.forEach((p, k) => {
      const n = chord[p % chord.length] + 24;
      const at = t + offset + k * step;
      this.tone(midi(n), at, 1.9, { type: 'sine', gain: 0.055, attack: 0.004, pluck: true });
      this.tone(midi(n) * 3, at, 0.45, { type: 'sine', gain: 0.012, attack: 0.002, pluck: true });
    });
  }

  private suspendNow() {
    if (this.el) this.el.pause();
    if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend();
  }

  private async resumeNow(): Promise<void> {
    try {
      if (this.el) {
        if (this.clock) {
          const t = this.clock() + config.music.lyricsOffsetSec;
          if (isFinite(t) && t > 0 && (!this.el.duration || t < this.el.duration)) this.el.currentTime = t;
        }
        await this.el.play();
      }
      if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
      this.set({ playing: true });
      this.fadeTo(this.targetLevel(), 700);
    } catch {
      this.set({ playing: false });
    }
  }
}

const engine = new Engine();

const actions = {
  start: engine.start,
  toggle: engine.toggle,
  setScene: engine.setScene,
  restartTrack: engine.restartTrack,
  registerClock: engine.registerClock,
};

export function useAudio() {
  const snap = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);
  return { ...snap, ...actions };
}

export type AudioApi = ReturnType<typeof useAudio>;
