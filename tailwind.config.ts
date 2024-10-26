import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
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
        'micro': ['"Micro 5"', 'sans-serif'],
      },
      colors: {
        'windows-teal': '#008080',
        'windows-gray-primary': '#c3c3c3',
        'windows-white': '#fdffff',
        'windows-gray-secondary': '#818181',
        'windows-blue': '#010081',
      },
      boxShadow: {
        'windows-inset': 'inset 1px 1px 3px #818181',
      },
    },
  },
  plugins: [],
} satisfies Config;
