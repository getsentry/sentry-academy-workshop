/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          // Background colors
          'dark': '#0a0a0f',
          'darker': '#050508',
          'dark-blue': '#0f1419',
          'dark-purple': '#1a0f2e',
          
          // Surface colors
          'surface': '#1a1a24',
          'surface-light': '#252538',
          'surface-hover': '#2d2d42',
          
          // Accent colors (neon)
          'cyan': '#00fff0',
          'pink': '#ff0080',
          'purple': '#8000ff',
          'green': '#00ff80',
          'yellow': '#ffff00',
          'orange': '#ff8000',
          
          // Text colors
          'text': '#e0e0e0',
          'text-muted': '#a0a0a0',
          'text-dim': '#606060',
        },
        // Glow effects
        glow: {
          'cyan': '#00fff033',
          'pink': '#ff008033',
          'purple': '#8000ff33',
          'green': '#00ff8033',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 5px currentColor',
        'glow': '0 0 10px currentColor',
        'glow-lg': '0 0 20px currentColor',
        'neon-cyan': '0 0 5px #00fff0, 0 0 10px #00fff0, 0 0 15px #00fff0',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 15px #ff0080',
        'neon-purple': '0 0 5px #8000ff, 0 0 10px #8000ff, 0 0 15px #8000ff',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 3s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}