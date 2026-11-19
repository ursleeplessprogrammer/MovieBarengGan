import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://movie-bareng-gan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MovieBarengGan — Find your next movie night",
    template: "%s | MovieBarengGan",
  },
  description: "Discover movies and TV shows, explore stories, and plan your next movie night with MovieBarengGan.",
  applicationName: "MovieBarengGan",
  keywords: ["movies", "TV shows", "movie discovery", "movie night", "TMDB"],
  openGraph: {
    type: "website",
    siteName: "MovieBarengGan",
    title: "MovieBarengGan — Find your next movie night",
    description: "Discover movies and TV shows for your next movie night.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "MovieBarengGan — Find your next movie night",
    description: "Discover movies and TV shows for your next movie night.",
  },
};

export const viewport: Viewport = {
  themeColor: "#090b10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Link href="#main-content" className="skip-link">Skip to main content</Link>
        <div id="main-content" tabIndex={-1}>{children}</div>
      </body>
    </html>
  );
}
