import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Captures d'écran des contributions (allégées sur le téléphone), sous la limite Vercel de 4,5 Mo.
    serverActions: { bodySizeLimit: "4mb" },
    // Deux racines (français et /en) : une page 404 commune.
    globalNotFound: true,
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
