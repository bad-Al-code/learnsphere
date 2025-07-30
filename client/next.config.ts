import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/profile",
        destination: "/settings/profile",
        permanent: true,
      },
      {
        source: "/profile/security",
        destination: "/settings/security",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "learnsphere-processed-media-xt9tcab6.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
