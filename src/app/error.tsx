"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the error available to the framework's reporting integrations.
    console.error("MovieBarengGan route error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#090b10] px-6 py-20 text-center text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#11151d] p-8 sm:p-10" role="alert">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
          <AlertTriangle size={25} aria-hidden="true" />
        </span>
        <p className="eyebrow mt-6">Something interrupted movie night</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">We hit a snag.</h1>
        <p className="mt-3 text-sm leading-6 text-white/55">
          This page could not finish loading. You can retry, or return to the home page.
        </p>
        {error.digest && <p className="mt-4 text-xs text-white/30">Reference: {error.digest}</p>}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#10140a] transition hover:bg-[#d8ff83]"
          >
            <RefreshCw size={15} aria-hidden="true" /> Try again
          </button>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 transition hover:border-white/35 hover:text-white">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
