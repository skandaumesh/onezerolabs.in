// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,

  // Lets a throwaway dev/build run write somewhere other than .next, so it does
  // not clobber the chunks a dev server is already serving. Unset in normal use.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  
  // Fix for GSC "Page with redirect" issue
  trailingSlash: false, // ✅ Ensures consistent URLs without trailing slashes
  
  headers: async () => {
    return [
      {
        source: '/:path*.html',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html; charset=utf-8',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
