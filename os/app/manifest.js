export default function manifest() {
  return {
    name: 'OneZeroLabs OS',
    short_name: 'OZL OS',
    description: 'Internal workspace for the OneZeroLabs co-founders.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F5F7',
    theme_color: '#F5F5F7',
    icons: [
      { src: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
