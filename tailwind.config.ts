import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        main: "url('/assets/bg.png')",
        redbar: "url('/assets/racing/red-bar.png')",
      },
      colors: {
        light: '#FFFAE4',
        beige: '#FFE9D1',
        'mid-brown': '#B97429',
        'dark-brown': '#4E2E15',
        red: '#C7473C',
        'dark-red': '#75261F',
        blue: '#0083FF',
        'dark-blue': '#0059AD',
        green: '#019052',
        orange: '#FF7A2F',
        'dark-orange': '#BF5C00',
        grey: '#787878',
        gray: '#2B2A2A',
        'gray-black': '#1B1B1B',
        'soft-cream': '#FADCB4',
        cream: '#E7DDD1',
        'primary-brass': '#B09668',
        'primary-orange': '#CD954A',
        'primary-dark': '#1E1E1E',
        'primary-darker': '#181818',
        correct: '#70B3A3',
        wrong: '#DE8073',
        'not-answered': '#9C8F80',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
      },
      grayscale: {
        50: '50%',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('daisyui'),
  ],
}
export default config
