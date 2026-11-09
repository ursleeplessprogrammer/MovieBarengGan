import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MovieBarengGan — Find your next movie night",
  description: "Discover movies, explore public-domain cinema, and build your next movie night with MovieBarengGan."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}