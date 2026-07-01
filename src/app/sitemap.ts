import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: abs("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: abs("/road-test"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: abs("/test"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
