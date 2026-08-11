/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'slate-deep': '#30364F',
        'slate-grey': '#ACBAC4',
        'warm-sand': '#E1D9BC',
        'soft-cream': '#F0F0DB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'modal-in': 'modal-in 0.3s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
      boxShadow: {
        card: '0 4px 24px rgba(48,54,79,0.10)',
        'card-hover': '0 12px 40px rgba(48,54,79,0.18)',
        modal: '0 24px 80px rgba(48,54,79,0.25)',
      },
    },
  },
  plugins: [],
}
