import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // External packages that should be treated as server-only
  serverExternalPackages: ['bcrypt'],
  
  // Ensure bcrypt is only used on the server
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to import bcrypt on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bcrypt: false,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig