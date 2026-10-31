import type { MetadataRoute } from "next";

// Phones read their home-screen icon from here; every icon is the same Horman mark.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Horman",
    short_name: "Horman",
    description: "Chat, create images, run agents and read the chain, all in one private AI workspace.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f4f2",
    theme_color: "#f2f4f2",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
