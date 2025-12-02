/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Fix for Coinbase CDP SDK x402-fetch dependency
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'x402-fetch': false,
      };
    }
    return config;
  },
};

export default nextConfig;
