/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '600' }],
                '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '700' }],
                '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '700' }],
                '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '800' }],
                '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.05em', fontWeight: '800' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '0.05em', fontWeight: '900' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '900' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '900' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '900' }],
            },
            fontFamily: {
                heading: "azeret-mono",
                paragraph: "azeret-mono"
            },
            colors: {
                // Enhanced Lavender color palette - deeper and more vibrant
                lavendergradientstart: '#A855F7',
                lavendergradientend: '#C084FC',
                lavender: {
                    50: '#F3E8FF',
                    100: '#E9D5FF',
                    200: '#D8B4FE',
                    300: '#C084FC',
                    400: '#A855F7',
                    500: '#9333EA',
                    600: '#7C2D92',
                    700: '#6B21A8',
                    800: '#581C87',
                    900: '#4C1D95',
                    950: '#2E1065'
                },
                // Complementary colors
                sage: {
                    50: '#F7F9F7',
                    100: '#EDF2ED',
                    200: '#D9E5D9',
                    300: '#B8CDB8',
                    400: '#91B091',
                    500: '#6D926D',
                    600: '#547654',
                    700: '#425E42',
                    800: '#364C36',
                    900: '#2D3F2D'
                },
                // Updated theme colors - more vibrant and contrasted
                gridline: '#D8B4FE',
                foreground: '#2E1065',
                background: '#FDFCFF',
                secondary: '#9333EA',
                'secondary-foreground': '#FFFFFF',
                'primary-foreground': '#FFFFFF',
                primary: '#6B21A8',
                accent: '#A855F7',
                'accent-foreground': '#FFFFFF',
                muted: '#E9D5FF',
                'muted-foreground': '#581C87'
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-in-left': 'slideInLeft 0.6s ease-out',
                'slide-in-right': 'slideInRight 0.6s ease-out',
                'scale-in': 'scaleIn 0.4s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'gradient-shift': 'gradientShift 4s ease-in-out infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' }
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' }
                }
            },
            backgroundImage: {
                'lavender-gradient': 'linear-gradient(135deg, #A855F7 0%, #C084FC 100%)',
                'lavender-gradient-soft': 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
                'lavender-gradient-dark': 'linear-gradient(135deg, #9333EA 0%, #6B21A8 100%)',
                'lavender-gradient-vibrant': 'linear-gradient(135deg, #C084FC 0%, #A855F7 50%, #9333EA 100%)',
                'lavender-radial': 'radial-gradient(circle at center, #A855F7 0%, #C084FC 100%)',
                'mesh-gradient': 'linear-gradient(135deg, #A855F7 0%, #C084FC 25%, #E9D5FF 50%, #D8B4FE 75%, #9333EA 100%)',
                'hero-gradient': 'linear-gradient(135deg, #9333EA 0%, #A855F7 50%, #C084FC 100%)'
            },
            boxShadow: {
                'lavender': '0 4px 14px 0 rgba(168, 85, 247, 0.35)',
                'lavender-lg': '0 10px 25px -3px rgba(168, 85, 247, 0.4), 0 4px 6px -2px rgba(192, 132, 252, 0.25)',
                'lavender-xl': '0 20px 25px -5px rgba(168, 85, 247, 0.45), 0 10px 10px -5px rgba(192, 132, 252, 0.3)',
                'inner-lavender': 'inset 0 2px 4px 0 rgba(168, 85, 247, 0.3)',
                'glow-lavender': '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(192, 132, 252, 0.3)'
            },
            backdropBlur: {
                'xs': '2px'
            }
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
