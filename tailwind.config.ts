import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["MS Sans Serif", "sans-serif"],
    },
    extend: {
      colors: {
        "windows-teal": "#3e9697",
      },
      fontFamily: {
        "ps-sans-nouveaux": ["PS Sans Nouveaux", "sans-serif"],
        "perfect-dos-vga": ["Perfect DOS VGA", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
