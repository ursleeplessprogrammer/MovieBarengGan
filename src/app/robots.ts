import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movie-bareng-gan.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/watch/"],
    },
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
