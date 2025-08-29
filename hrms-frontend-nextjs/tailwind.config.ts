import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "300px",
        xs: "440px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // Custom Palettes
        lightblue: {
          50: "#E6F4F9",
          100: "#B0DCEE",
          200: "#8ACBE5",
          300: "#54B3D9",
          400: "#33A5D2",
          500: "#008EC7",
          600: "#0081B5",
          700: "#00658D",
          800: "#004E6D",
          900: "#003C54",
        },
        darkblue: {
          50: "#E7ECF0",
          100: "#B4C3D0",
          200: "#8FA6B9",
          300: "#5C7E98",
          400: "#3D6585",
          500: "#0C3E66",
          600: "#0B385D",
          700: "#092C48",
          800: "#072238",
          900: "#051A2B",
        },
        orange: {
          50: "#FDF1EA",
          100: "#F8D3BC",
          200: "#F5BE9C",
          300: "#F0A06F",
          400: "#ED8D53",
          500: "#E97128",
          600: "#D46724",
          700: "#A5501C",
          800: "#803E16",
          900: "#622F11",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
