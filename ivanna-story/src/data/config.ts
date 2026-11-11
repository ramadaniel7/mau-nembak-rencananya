/**
 * ============================================================
 *  CENTRAL CONFIGURATION — edit everything personal HERE.
 *  Texts live in content.ts, verses in verses.ts, lyrics in lyrics.ts.
 * ============================================================
 */
export const config = {
  recipient: {
    firstName: 'Ivanna',
    // Fill in the full name (including the middle name) if you want it shown anywhere.
    fullName: 'Ivanna Yemia Putri',
    // Order matters: [0] main name, [1] "Miaa", [2] "Mikuuu", [3] "Yemiaa"
    nicknames: ['Ivanna', 'Miaa', 'Mikuuu', 'Yemiaa'],
  },

  owner: {
    name: 'Daniel',
  },

  whatsapp: {
    // International format, digits only (no +, no spaces, no leading 0).
    // +62 838 7002 8215  ->  6283870028215
    number: '6283870028215',
    sentFrom: 'A Little Story for Ivanna 🌷',
  },

  site: {
    title: 'A Little Story for Ivanna ♡',
    madeBy: 'Made with love, by Daniel.',
  },

  palette: {
    rosePink: '#F4A7B9',
    softPink: '#F8C8D4',
    blush: '#FCE4EC',
    white: '#FFFFFF',
    cream: '#FFF9F7',
    lavender: '#E8DDF8',
    softRoseText: '#B76E85',
    // Darker rose used for body text / lyrics so contrast stays readable.
    deepText: '#7E3F58',
    deepTextStrong: '#5E2A40',
  },

  music: {
    /**
     * Leave EMPTY to use the built-in original instrumental (generated live in the browser:
     * soft piano, music box, dreamy pads). To use your own file, put it in /public/audio/
     * and set e.g. './audio/story.mp3'. Only use music you own or have a licence for.
     * If the file is missing or fails to load, the built-in instrumental plays instead.
     */
    src: '',
    volume: { ambient: 0.35, cinematic: 0.6 },
    fadeMs: 1800,
    // Seconds of silence at the start of your own audio file before the music "begins".
    // Lyrics start this many seconds later. Ignored by the built-in instrumental.
    lyricsOffsetSec: 0,
  },

  animation: {
    petalCount: 16,
    sparkleCount: 26,
    heartCount: 8,
    typingSpeedMs: 55,
    // How many times the NO button runs away before it stops and lets you click it.
    maxNoDodges: 6,
    noProximityPx: 110,
  },

  storageKey: 'little-story-for-ivanna:v1',
};

export type Config = typeof config;
