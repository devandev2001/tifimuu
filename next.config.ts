import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do NOT set output: "standalone" for Vercel — Vercel runs Next.js natively.
  // Use standalone only for self-hosted Node (e.g. Hostinger VPS) if needed later.
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
