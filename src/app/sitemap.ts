import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movie-bareng-gan.vercel.app";
  const lastModified = new Date();

  return ["/", "/discover", "/tv", "/search"].map((route) => ({
    url: `${baseUrl.replace(/\/$/, "")}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
