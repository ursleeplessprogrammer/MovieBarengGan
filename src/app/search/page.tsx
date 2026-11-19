import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal } from "lucide-react";

import { Header } from "@/components/header";
import { MovieCard } from "@/components/movie-card";
import { TVShowCard } from "@/components/tv-show-card";
import { searchCatalog } from "@/lib/tmdb";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string; type?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const type = params.type === "movie" || params.type === "tv" ? params.type : "all";
  const requestedPage = Number(params.page ?? "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  let results: Awaited<ReturnType<typeof searchCatalog>> = {
    items: [], totalPages: 0, totalResults: 0,
  };
  let searchError = false;

  if (query) {
    try {
      results = await searchCatalog(query, page, type);
    } catch {
      searchError = true;
    }
  }

  const currentPage = Math.min(page, Math.max(1, results.totalPages));
  function pageUrl(nextPage: number) {
    const params = new URLSearchParams({ q: query, type, page: String(nextPage) });
    return `/search?${params.toString()}`;
  }

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />
      <section className="page-shell pb-20 pt-32">
        <div className="mb-10">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c7f36b]">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <p className="text-xs font-bold tracking-[0.2em] text-[#c7f36b]">DISCOVER YOUR NEXT FAVORITE</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Find your <span className="text-[#c7f36b]">next watch.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
            Search movies and TV shows together, or narrow the results to one format.
          </p>
        </div>

        <form action="/search" method="GET" className="mb-12 grid gap-3 sm:grid-cols-[1fr_190px_auto]">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#111620] px-4 transition focus-within:border-[#c7f36b]/60">
            <Search size={19} className="shrink-0 text-white/35" />
            <input type="search" name="q" defaultValue={query} placeholder="Search movies or TV shows..." aria-label="Search movies and TV shows" className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
          </div>
          <select name="type" defaultValue={type} aria-label="Content type" className="h-14 rounded-xl border border-white/10 bg-[#111620] px-4 text-sm text-white outline-none focus:border-[#c7f36b]/60">
            <option value="all">Movies & TV shows</option>
            <option value="movie">Movies only</option>
            <option value="tv">TV shows only</option>
          </select>
          <button type="submit" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-8 text-sm font-black text-[#10140a] transition hover:bg-[#d8ff83]">
            <Search size={16} /> Search
          </button>
        </form>

        {searchError ? (
          <div role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-16 text-center">
            <h2 className="text-xl font-bold">Search is temporarily unavailable</h2>
            <p className="mt-2 text-sm text-white/45">We couldn&apos;t retrieve results from TMDB. Please try again.</p>
          </div>
        ) : !query ? (
          <div className="rounded-2xl border border-white/[.07] bg-[#111620] px-6 py-20 text-center">
            <Search size={38} className="mx-auto text-[#c7f36b]" />
            <h2 className="mt-5 text-xl font-bold">What would you like to watch?</h2>
            <p className="mt-2 text-sm text-white/40">Search by a movie or TV show title.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/discover" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:border-[#c7f36b]">Explore movies</Link>
              <Link href="/tv" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:border-[#c7f36b]">Browse TV shows</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#c7f36b]">SEARCH RESULTS</p>
                <h2 className="mt-2 text-2xl font-black">Results for &ldquo;{query}&rdquo;</h2>
                <p className="mt-2 text-sm text-white/40">{results.totalResults.toLocaleString()} results found</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/35"><SlidersHorizontal size={14} /> {type === "all" ? "Movies & TV shows" : type === "movie" ? "Movies" : "TV shows"}</div>
            </div>

            {results.items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {results.items.map((result) => result.mediaType === "movie"
                    ? <MovieCard key={`movie-${result.item.id}`} movie={result.item} />
                    : <TVShowCard key={`tv-${result.item.id}`} show={result.item} />)}
                </div>
                {results.totalPages > 1 && (
                  <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
                    {currentPage > 1 && <Link href={pageUrl(currentPage - 1)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-[#c7f36b] hover:text-[#c7f36b]"><ArrowLeft size={15} /> Previous</Link>}
                    <span className="px-3 text-sm text-white/45">Page {currentPage} of {results.totalPages}</span>
                    {currentPage < results.totalPages && <Link href={pageUrl(currentPage + 1)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-[#c7f36b] hover:text-[#c7f36b]">Next <ArrowRight size={15} /></Link>}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-white/[.07] bg-[#111620] px-6 py-20 text-center">
                <Search size={38} className="mx-auto text-white/25" />
                <h2 className="mt-5 text-xl font-bold">No titles found</h2>
                <p className="mt-2 text-sm text-white/40">Try another title or switch the content filter.</p>
              </div>
            )}
          </>
        )}
      </section>
      <footer className="border-t border-white/[.07] py-8"><div className="page-shell text-center text-xs text-white/30">Movie and TV metadata provided by TMDB.</div></footer>
    </main>
  );
}
