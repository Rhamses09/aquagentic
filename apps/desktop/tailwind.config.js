/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: '#060d17',
          abyssal: '#03070d',
          surface: '#0f1f33',
          glow: '#00e5ff'
        }
      },
      animation: {
        'swim-slow': 'swim 12s ease-in-out infinite',
        'swim-medium': 'swim 8s ease-in-out infinite',
        'swim-fast': 'swim 5s ease-in-out infinite',
        'bob': 'bob 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite'
      },
      keyframes: {
        swim: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(40px, -15px, 0)' }
        },
        bob: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' }
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        }
      }
    }
  },
  plugins: []
};
