import type { Config } from 'tailwindcss';
import tailwindForms from '@tailwindcss/forms';

const config: Config = {
  content: [
    '@/pages/**/*.{js,ts,jsx,tsx,mdx}',
    '@/components/**/*.{js,ts,jsx,tsx,mdx}',
    '@/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          900: '#171772',
        },
      },
    },
  },
  plugins: [tailwindForms],
};
export default config;
