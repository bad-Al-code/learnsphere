import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true, // NOTE: Only for development
  // },

  async redirects() {
    return [
      {
        source: '/profile',
        destination: '/settings/profile',
        permanent: true,
      },
      {
        source: '/profile/security',
        destination: '/settings/security',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'learnsphere-processed-media-xt9tcab6.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
