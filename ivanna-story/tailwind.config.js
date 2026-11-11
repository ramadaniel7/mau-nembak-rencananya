/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Colours are CSS variables (RGB triplets) so they can be changed from src/data/config.ts
      colors: {
        rosepink: 'rgb(var(--c-rose) / <alpha-value>)',
        softpink: 'rgb(var(--c-soft) / <alpha-value>)',
        blush: 'rgb(var(--c-blush) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        lavender: 'rgb(var(--c-lavender) / <alpha-value>)',
        rosetext: 'rgb(var(--c-rose-text) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        inkdeep: 'rgb(var(--c-ink-deep) / <alpha-value>)',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        vibes: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
};
