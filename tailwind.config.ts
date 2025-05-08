import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                primary: '#009900',
                secondary: '#0284c7',
            },
            keyframes: {
                pulseBorder: {
                    '0%, 100%': { borderColor: 'rgba(249, 115, 22, 1)' },
                    '50%': { borderColor: 'rgba(249, 115, 22, 0.5)' },
                },
            },
            animation: {
                'pulse-border': 'pulseBorder 1.5s ease-in-out infinite',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};

export default config;
