/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Biomes
        'biome-hub': '#f59e0b',
        'biome-plain': '#a3e635',
        'biome-forest': '#047857',
        'biome-hills': '#78716c',
        'biome-ruins': '#475569',
        'biome-village': '#fdba74',
      },
      animation: {
        'reveal': 'reveal 0.3s ease-out',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
