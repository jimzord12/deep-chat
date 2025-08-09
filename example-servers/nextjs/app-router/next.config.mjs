/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/OvidijusParsiunas/deep-chat/HEAD/website/static/img/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
