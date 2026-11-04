import { Inter } from 'next/font/google'
import { TouchFeedback } from '@/components/TouchFeedback'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
  variable: '--font-inter',
})

export const metadata = {
  title: { default: 'OneZeroLabs OS', template: '%s | OneZeroLabs OS' },
  description: 'Internal workspace for the OneZeroLabs co-founders.',
  robots: { index: false, follow: false },
  icons: { apple: '/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'OZL OS', statusBarStyle: 'default' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // Draws under the iPhone's notch and home bar; the layout pads itself clear.
  viewportFit: 'cover',
}

/**
 * Sets the theme before the first paint, so a dark page never flashes white.
 * It runs inline because anything loaded later would be too late. The choice is
 * per device: 'light', 'dark', or nothing to follow the device, including when
 * the device changes while the page is open.
 */
const THEME_SCRIPT = `(function () {
  var root = document.documentElement;
  var system = matchMedia('(prefers-color-scheme: dark)');
  function apply() {
    var choice = null;
    try { choice = localStorage.getItem('os-theme'); } catch (e) {}
    var theme = choice === 'light' || choice === 'dark' ? choice : system.matches ? 'dark' : 'light';
    root.dataset.theme = theme;
    var bar = document.querySelector('meta[name="theme-color"]');
    if (!bar) {
      bar = document.createElement('meta');
      bar.name = 'theme-color';
      document.head.appendChild(bar);
    }
    bar.content = theme === 'dark' ? '#000000' : '#F5F5F7';
  }
  window.__applyTheme = apply;
  apply();
  system.addEventListener('change', apply);
})();`

export default function RootLayout({ children }) {
  return (
    // The script above changes this element before React loads, on purpose.
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`font-sans text-body antialiased ${inter.variable}`}>
        <TouchFeedback />
        {children}
      </body>
    </html>
  )
}
