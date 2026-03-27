/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // UUSI tapa (ei enää experimental)
  typedRoutes: true,

  // Vercel + modern setup
  experimental: {
    serverActions: true
  }
};

export default nextConfig;
