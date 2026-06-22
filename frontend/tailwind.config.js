/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Sky gradient stops - referenced by name in index.css gradient classes
        'sky-day-start': '#4A90D9',
        'sky-day-end': '#7EC4E8',
        'sky-night-start': '#0B1330',
        'sky-night-end': '#2B3A6B',
        'sky-cloud-start': '#5C6B7E',
        'sky-cloud-end': '#8A95A5',
        'sky-storm-start': '#222E45',
        'sky-storm-end': '#465875',

        // Warm sun/moon accent (matches reference screenshots' yellow icons)
        sun: '#FFC857',
        'sun-soft': '#FFE3A3',

        // Glassmorphic surface tokens for data tiles over the gradient
        glass: 'rgba(255,255,255,0.14)',
        'glass-strong': 'rgba(255,255,255,0.22)',
        'glass-border': 'rgba(255,255,255,0.22)',

        // Text tokens for on-gradient (dark background) contexts
        'text-on-sky': '#FFFFFF',
        'text-on-sky-muted': 'rgba(255,255,255,0.72)',
        'text-on-sky-faint': 'rgba(255,255,255,0.48)',

        // Functional accents - one distinct hue per data category, used consistently
        // across the data grid so each metric has its own visual identity
        accentRain: '#6FB3E0',
        accentWind: '#9FD8C8',
        accentUv: '#FFB870',
        accentHumidity: '#7FC9E8',
        accentPressure: '#C9B6E8',
        accentAlert: '#FF8A65',

        // Light-mode tokens, used below the fold for the trip planner / saved trips
        // sections which sit on a plain paper background rather than the sky gradient
        paper: '#F4F2ED',
        card: '#FFFFFF',
        ink: '#1C2433',
        muted: '#6B7280',
        pine: '#3D6B5C',
        'pine-light': '#5C8A78',
        ember: '#C1561E',
        line: '#E4E1D8',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'drift-slow': {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        'drift-slower': {
          '0%': { transform: 'translateX(-15%)' },
          '100%': { transform: 'translateX(115%)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        },
        'sun-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.55 },
          '50%': { transform: 'scale(1.08)', opacity: 0.75 },
        },
        'rain-fall': {
          '0%': { transform: 'translateY(-10%)', opacity: 0 },
          '10%': { opacity: 0.6 },
          '100%': { transform: 'translateY(110vh)', opacity: 0.2 },
        },
        'snow-fall': {
          '0%': { transform: 'translateY(-10%) translateX(0)', opacity: 0 },
          '10%': { opacity: 0.9 },
          '100%': { transform: 'translateY(110vh) translateX(20px)', opacity: 0.3 },
        },
        'lightning-flash': {
          '0%, 92%, 100%': { opacity: 0 },
          '93%': { opacity: 0.9 },
          '94%': { opacity: 0.1 },
          '95%': { opacity: 0.7 },
          '96%': { opacity: 0 },
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'drift-slow': 'drift-slow 60s linear infinite',
        'drift-slower': 'drift-slower 90s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'sun-pulse': 'sun-pulse 4s ease-in-out infinite',
        'rain-fall': 'rain-fall 1s linear infinite',
        'snow-fall': 'snow-fall 8s linear infinite',
        'lightning-flash': 'lightning-flash 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
