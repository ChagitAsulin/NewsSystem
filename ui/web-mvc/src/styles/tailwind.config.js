//module.exports = {};

/*
תפקיד: קובץ קונפיגורציה מרכזי של Tailwind – כאן נגדיר צבעים מותאמים אישית,
 אנימציות מיוחדות, רספונסיביות ואפשרויות פרויקט מרשים.
*/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#9333EA',
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#FBBF24',
        danger: '#EF4444',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        pulseSlow: 'pulseSlow 2s ease-in-out infinite',
      },
      borderRadius: {
        'xl-2': '1.5rem',
      },
    },
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      serif: ['Merriweather', 'serif'],
      mono: ['Fira Code', 'monospace'],
    },
  },
  plugins: [],
};
