import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phase 4: Security & Performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Minimal referrer info cross-origin
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable intrusive browser APIs not used by this site
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // Enable DNS prefetch for fonts
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },

  // Production image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Strict mode for React 19
  reactStrictMode: true,
};

export default nextConfig;
