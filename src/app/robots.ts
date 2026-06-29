import type { MetadataRoute } from "next";
import { DEFAULT_SITE_URL } from "@/content/brand";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/cek"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
