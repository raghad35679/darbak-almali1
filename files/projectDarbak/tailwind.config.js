/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        saudi: {
          50: '#E6F4ED',
          100: '#C8E6D5',
          200: '#92CDB0',
          300: '#5CB48B',
          400: '#3A9E72',
          500: '#006C35',
          600: '#005C2D',
          700: '#004A24',
          800: '#00381B',
          900: '#002612',
        },
        beige: {
          50: '#FDFCF8',
          100: '#F8F5EF',
          200: '#F0EBE0',
          300: '#E5DDC9',
          400: '#D4C9A8',
        },
        ink: {
          900: '#0F1A14',
          800: '#1A2B20',
          700: '#2A3D30',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0, 108, 53, 0.06)',
        'soft-lg': '0 8px 32px rgba(0, 108, 53, 0.10)',
        'soft-xl': '0 16px 48px rgba(0, 108, 53, 0.14)',
        glow: '0 0 24px rgba(0, 108, 53, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'progress': 'progress 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        progress: {
          '0%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
};
