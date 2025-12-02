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
        primary: '#22d3ee',      // תכלת
        secondary: '#1D4ED8',    // כחול עמוק
        accent: '#9333EA',       // סגול
        highlight: '#fb923c',    // כתום/אפרסק
        pink: '#f472b6',         // ורוד
        turquoise: '#40E0D0',    // טורקיז
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
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.05)' },
        },
        gradientShift: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        pulseSlow: 'pulseSlow 2s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        gradientShift: 'gradientShift 15s ease infinite',
      },
      borderRadius: {
        'xl-2': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
