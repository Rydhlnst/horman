import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PAGES = ["", "/chat", "/agents", "/onchain", "/token", "/check", "/scan", "/tx", "/guides", "/pricing", "/topup", "/developers", "/access"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly", priority: p ? 0.7 : 1 }));
}
