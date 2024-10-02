/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@aws-sdk"],
  },
};

export default nextConfig;
