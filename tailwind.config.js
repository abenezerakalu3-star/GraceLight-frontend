/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    400: '#E6C766',
                    500: '#D4AF37', // Primary Gold
                    600: '#B4942B',
                },
                dark: {
                    900: '#0a0a0a', // Main Background
                    800: '#1a1a1a', // Secondary Background / Cards
                    700: '#2a2a2a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Merriweather', 'serif'], // For spiritual feel
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
