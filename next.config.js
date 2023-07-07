/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack(config) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
    
        return config;
    },
    images: {
      domains: ["qr-theme-image.s3.us-east-2.amazonaws.com"]
    }
}

module.exports = nextConfig
