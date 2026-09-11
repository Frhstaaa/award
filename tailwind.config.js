import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', ...defaultTheme.fontFamily.sans],
                display: ['Cinzel', 'Playfair Display', 'serif'],
            },
            colors: {
                gold: {
                    50: '#fffdf5',
                    100: '#fef9e2',
                    200: '#fcf0be',
                    300: '#f9e390',
                    400: '#f5d15c',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                    metallic: '#D4AF37',
                    light: '#F8E8A2',
                    dark: '#996515',
                },
                gala: {
                    darkest: '#05070d',
                    darker: '#0a0e1a',
                    dark: '#10172a',
                    card: '#141d33',
                    border: 'rgba(212, 175, 55, 0.2)',
                },
            },
            boxShadow: {
                'gold-glow': '0 0 25px rgba(212, 175, 55, 0.45)',
                'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.65)',
                'curtain-fold': 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 10px 30px rgba(0,0,0,0.9)',
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #F8E8A2 0%, #D4AF37 50%, #996515 100%)',
                'gold-gradient-radial': 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(10,14,26,0) 70%)',
            },
        },
    },

    plugins: [forms],
};
