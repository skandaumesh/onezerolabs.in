// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  
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
