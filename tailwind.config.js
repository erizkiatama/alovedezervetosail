/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        envelope: {
          dark: '#2e3d30',
          mid: '#3d5240',
          light: '#4a6450',
          accent: '#8aaa7a',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          dark: '#ebe5d8',
          deeper: '#e0d9cc',
        },
        wax: {
          DEFAULT: '#922b21',
          light: '#c0392b',
          dark: '#641e16',
        },
        gold: {
          DEFAULT: '#c8a96e',
          light: '#d4bc8a',
          dark: '#a8873e',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Cormorant Garamond', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'flap-open': 'flapOpen 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(140px)', opacity: '0.3' },
          to: { transform: 'translateY(-90px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
