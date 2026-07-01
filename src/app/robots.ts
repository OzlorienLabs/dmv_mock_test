import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Interactive/session-only or private routes add no crawl value.
      disallow: ["/api/", "/settings"],
    },
    sitemap: abs("/sitemap.xml"),
    host: abs("/"),
  };
}
