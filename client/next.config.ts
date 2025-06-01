/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      process.env.NEXT_PUBLIC_CLIENT_URL, // picks from your env vars
      'https://rtsp-stream-viewer-theta.vercel.app',
    ].filter(Boolean),
  },
};

module.exports = nextConfig;
