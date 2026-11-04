/* Colours are defined in globals.css, once for light and once for dark. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  // A finger has no hover. Without this, a tapped row stays highlighted on a phone.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        ink: token('ink'),
        ink2: token('ink2'),
        muted: token('muted'),
        canvas: token('canvas'),
        surface: token('surface'),
        raised: token('raised'),
        field: token('field'),
        fill: { DEFAULT: token('fill'), hover: token('fill-hover') },
        thumb: token('thumb'),
        pill: token('pill'),
        sidebar: token('sidebar'),
        // Documents are white paper in light and dark mode alike, as on iPhone.
        paper: token('paper'),
        line: 'var(--line)',
        // `accent` is for text and icons; `fill` keeps white button text readable.
        accent: { DEFAULT: token('accent'), fill: token('accent-fill'), press: token('accent-press') },
        late: { DEFAULT: token('late'), soft: token('late-soft') },
        soon: { DEFAULT: token('soon'), soft: token('soon-soft') },
        good: { DEFAULT: token('good'), soft: token('good-soft') },
      },
      fontFamily: {
        // Real San Francisco on iPhone and Mac; Inter, its closest match, elsewhere.
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'var(--font-inter)', 'Segoe UI', 'sans-serif'],
      },
      // Tracking and leading change with size: tight as type grows, open as it
      // shrinks. In rem, so they follow the phone's text-size setting.
      fontSize: {
        display: ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.026em', fontWeight: '700' }],
        'large-title': ['2.125rem', { lineHeight: '1.1', letterSpacing: '-0.022em', fontWeight: '700' }],
        title: ['1.75rem', { lineHeight: '1.14', letterSpacing: '-0.02em', fontWeight: '700' }],
        // The buttons of an action sheet.
        action: ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.016em' }],
        headline: ['1.0625rem', { lineHeight: '1.3', letterSpacing: '-0.012em', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.42', letterSpacing: '-0.008em' }],
        sub: ['0.9375rem', { lineHeight: '1.4', letterSpacing: '-0.006em' }],
        foot: ['0.8125rem', { lineHeight: '1.36', letterSpacing: '0' }],
        cap: ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.002em' }],
        tab: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.004em' }],
      },
      borderRadius: {
        card: '1.25rem',
      },
    },
  },
  plugins: [],
}
