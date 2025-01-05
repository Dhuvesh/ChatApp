import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 10s infinite',
        'float-delayed': 'float 12s infinite -2s',
        'float-slow': 'float 14s infinite -4s',
        'grid-fade': 'grid-fade 15s infinite',
        'particle': 'particle 20s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
          '33%': { transform: 'translate(10px, -50px) rotate(10deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(-5deg)' },
        },
        'grid-fade': {
          '0%, 100%': { opacity: 0.1 },
          '50%': { opacity: 0.2 },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(-100vh) translateX(100px)', opacity: 0 },
        },
      },
    },
  },
  plugins: [daisyui],
  // DaisyUI theme configuration
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
    darkTheme: "dark",
  },
}