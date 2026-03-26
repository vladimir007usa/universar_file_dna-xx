/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#050505',
        'ghost-green': '#00ff41',
        'warning-amber': '#ff9100',
        'risk-low': '#00ff41',
        'risk-medium': '#0080ff',
        'risk-high': '#ff9100',
        'risk-critical': '#ff3131',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
        'matrix': 'matrix 20s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%': { opacity: '0.97' },
          '100%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [],
}
