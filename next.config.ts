import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // The parent folder has its own pnpm workspace and PostCSS config; this app stands alone.
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
