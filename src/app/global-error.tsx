"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("MovieBarengGan fatal application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#090b10", color: "#f5f6f7", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", textAlign: "center" }}>
          <section style={{ maxWidth: 480 }}>
            <p style={{ color: "#c7f36b", fontSize: 11, fontWeight: 800, letterSpacing: ".18em" }}>MOVIEBARENGGAN</p>
            <h1 style={{ fontSize: 36, lineHeight: 1.1 }}>Something went wrong.</h1>
            <p style={{ color: "#9299a8", lineHeight: 1.6 }}>The app encountered an unexpected error. Please try again.</p>
            <button onClick={() => reset()} style={{ marginTop: 16, border: 0, borderRadius: 999, background: "#c7f36b", color: "#111", padding: "12px 20px", fontWeight: 800, cursor: "pointer" }}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
