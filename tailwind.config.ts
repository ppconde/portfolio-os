import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"MS Reference Sans Serif"', ...defaultTheme.fontFamily.sans],
        serif: [...defaultTheme.fontFamily.serif],
        mono: [...defaultTheme.fontFamily.mono],
        'ps-sans-nouveaux': ['"PX Sans Nouveaux"', 'sans-serif'],
        'perfect-dos-vga': ['"Perfect DOS VGA 437"', 'sans-serif'],
        'perfect-dos-vga-win': ['"Perfect DOS VGA 437 Win"', 'sans-serif'],
        'ms-reference': ['"MS Reference Sans Serif"', 'sans-serif'],
        micro: ['"Micro 5"', 'sans-serif'],
      },
      colors: {
        'windows-teal': '#008080',
        'windows-gray-primary': '#c3c3c3',
        'windows-white': '#fdffff',
        'windows-gray-secondary': '#818181',
        'windows-blue': '#010081',
        'window-super-blue': '#0000ff',
        'windows-purple': '#800080',
      },
      boxShadow: {
        'windows-inset': 'inset 1px 1px 3px #818181',
      },
      backgroundImage: {
        'dot-pattern': `radial-gradient(#0000ff 0.5px, transparent 0.5px), radial-gradient(#0000ff 0.5px, #ffffff 0.5px)`,
      },
    },
  },
  plugins: [],
} satisfies Config;
