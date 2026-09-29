/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",   // 1rem padding on mobile
        sm: "2rem",        // 2rem padding on tablet+
        lg: "4rem",        // 4rem padding on desktop
        xl: "5rem",        // 5rem padding on large screens
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // 1. EXTENDED SCREENS: Adds control for very small and very large screens
      screens: {
        'xs': '475px',      // Useful for small iPhones (SE/Mini)
        '3xl': '1920px',    // Useful for 1080p+ and 4k monitors
      },
      colors: {
        // OneZeroLabs visual direction. One source of truth -- components
        // reference these rather than hardcoding hex values.
        ozl: {
          base: '#FFFFFF',                        // page background
          surface: '#FFFFFF',                     // raised panel
          glass: 'rgba(255,255,255,0.65)',        // glass fill
          glassBorder: 'rgba(15,23,42,0.08)',     // glass edge
          ink: '#0B0D12',                         // primary text
          muted: '#667085',                       // secondary text
          violet: '#6C63FF',                      // primary ambient glow
          sky: '#7DD3FC',                         // secondary ambient glow
          cta: '#111827',                         // deep navy call to action
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["var(--font-eb-garamond)", "serif"],
        serif: ["var(--font-eb-garamond)", "serif"],
        garamond: ["var(--font-eb-garamond)", "serif"],
        syne: ["Syne", "sans-serif"], // Custom font for headers
      },
      transitionTimingFunction: {
        // Reference easing: slow out, decisive in. Noticeably less "linear"
        // than Tailwind's default ease-in-out on buttons.
        ozl: 'cubic-bezier(.2, 0, 0, 1)',
      },
      transitionDuration: {
        ozl: '350ms',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Track holds two identical copies of the logo list; shifting by half
        // its width lands copy 2 exactly where copy 1 began -> seamless loop.
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 1s ease-out forwards",
        "fade-up": "fade-up 1s ease-out forwards",
        "marquee": "marquee 140s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}