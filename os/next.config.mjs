/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app sits inside the public site's repository, with its own lockfile.
  // Without these, Next takes the parent folder for the project root.
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,

  // PGlite ships a WASM build of Postgres and pg has optional native bindings;
  // neither survives bundling, so both load from node_modules at runtime.
  // pdfmake reads its font metrics from disk, which bundling would break.
  serverExternalPackages: ['@electric-sql/pglite', 'pg', 'pdfmake'],

  // The invoice PDF reads these from disk, so hosting must carry them along.
  outputFileTracingIncludes: {
    '/invoices/[id]/pdf': ['./node_modules/pdfmake/fonts/Roboto/**', './public/logo-print.png'],
    '/documents/pdf-worker': ['./node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs'],
    '/documents/pdf-data/[version]/[kind]/[file]': [
      './node_modules/pdfjs-dist/standard_fonts/**',
      './node_modules/pdfjs-dist/cmaps/**',
      './node_modules/pdfjs-dist/wasm/*.wasm',
      './node_modules/pdfjs-dist/iccs/**',
    ],
  },

  // Lets a phone on the same Wi-Fi open the dev server by this computer's
  // address, so the phone layout can be tried on a real phone.
  allowedDevOrigins: ['10.*.*.*', '192.168.*.*'],

  // Documents go up one file at a time, at most 4 MB each (lib/documents.mjs).
  experimental: { serverActions: { bodySizeLimit: '4.5mb' } },

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Private workspace: no search engines, no framing, no referrers.
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
    ]
  },
}

export default nextConfig
