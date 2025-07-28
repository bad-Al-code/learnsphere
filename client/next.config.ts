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
};

export default nextConfig;
