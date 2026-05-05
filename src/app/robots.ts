import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/", "/profile/", "/settings/"] },
    ],
    sitemap: `${SITE.domain.replace(/\/$/, "")}/sitemap.xml`,
    host: SITE.domain.replace(/\/$/, ""),
  };
}
