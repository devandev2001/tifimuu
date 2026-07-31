import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Smaller Node deploy for Hostinger SSR / Web Apps hosting.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
