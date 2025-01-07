/* eslint-disable @typescript-eslint/no-require-imports */
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
        'windows-super-blue': '#0000ff',
        'windows-purple': '#800080',
      },
      boxShadow: {
        'windows-inset': 'inset 1px 1px 3px #818181',
      },
      backgroundImage: {
        dots: 'radial-gradient(#0000ffcc 1px, transparent 1px), radial-gradient(#0000ffcc 1px, #ffffff 1px)',
      },
      transitionProperty: {
        'max-height': 'max-height',
      },
      animation: {
        blink: 'blink 0.333s infinite', // 3 times per second, infinite loop
      },
      keyframes: {
        blink: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
} satisfies Config;
