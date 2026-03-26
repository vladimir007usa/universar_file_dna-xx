/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#000000',
        'rage-red': '#FF0000',
        'static-cyan': '#00FFFF',
        'warning-amber': '#FFBF00',
        'risk-low': '#00FFFF',
        'risk-medium': '#FFBF00',
        'risk-high': '#FF0000',
        'risk-critical': '#FF0000',
      },
      fontFamily: {
        'mono': ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.1s infinite',
        'scanline': 'scanline 4s linear infinite',
        'glitch': 'glitch 0.2s cubic-bezier(.25,.46,.45,.94) both infinite',
        'jitter': 'jitter 0.1s infinite',
        'static-burst': 'static-burst 0.1s steps(2) infinite',
        'melt': 'melt 3s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%': { opacity: '0.9' },
          '100%': { opacity: '1' },
        },
        jitter: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '25%': { transform: 'translate(1px, -1px)' },
          '50%': { transform: 'translate(-1px, 1px)' },
          '75%': { transform: 'translate(1px, 1px)' },
        },
        'static-burst': {
          '0%': { backgroundPosition: '0 0', opacity: '0.05' },
          '100%': { backgroundPosition: '100% 100%', opacity: '0.1' },
        },
        melt: {
          '0%, 100%': { borderBlur: '0px', transform: 'scale(1)' },
          '50%': { borderBlur: '10px', transform: 'scale(0.98) translateY(5px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 3px)', clipPath: 'inset(10% 0 10% 0)' },
          '40%': { transform: 'translate(3px, -3px)', clipPath: 'inset(40% 0 20% 0)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [],
}
