export default function Loading() {
  return (
    <main className="min-h-screen bg-[#090b10] px-4 pb-20 pt-32 text-white" aria-busy="true" aria-live="polite">
      <div className="page-shell">
        <p className="eyebrow mb-4">Preparing your next movie night</p>
        <div className="h-10 w-64 max-w-full animate-pulse rounded-lg bg-white/10" />
        <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-white/[.06]" />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="min-w-0">
              <div className="aspect-[2/3] animate-pulse rounded-xl border border-white/[.06] bg-[#171c25]" />
              <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-white/[.06]" />
            </div>
          ))}
        </div>
        <span className="sr-only">Loading content…</span>
      </div>
    </main>
  );
}
