
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Header } from "@/components/header";
import { MovieCard } from "@/components/movie-card";
import { searchMovies } from "@/lib/tmdb";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = (params.q ?? "").trim();
  const requestedPage = Number(params.page ?? "1");
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  let results = {
    movies: [],
    totalPages: 0,
    totalResults: 0,
  } as Awaited<ReturnType<typeof searchMovies>>;

  let searchError = false;

  if (query) {
    try {
      results = await searchMovies(query, page);
    } catch {
      searchError = true;
    }
  }

  const currentPage = Math.min(
    page,
    Math.max(1, results.totalPages),
  );

  function pageUrl(nextPage: number) {
    return `/search?q=${encodeURIComponent(query)}&page=${nextPage}`;
  }

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        {/* Heading */}
        <div className="mb-10">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c7f36b]"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>

          <p className="text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
            DISCOVER YOUR NEXT FAVORITE
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Find your <span className="text-[#c7f36b]">movie.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
            Search through thousands of movies and discover something
            worth watching.
          </p>
        </div>

        {/* Search form */}
        <form
          action="/search"
          method="GET"
          className="mb-12 flex flex-col gap-3 sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#111620] px-4 transition focus-within:border-[#c7f36b]/60">
            <Search size={19} className="shrink-0 text-white/35" />

            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search movies by title..."
              aria-label="Search movies"
              className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-8 text-sm font-black text-[#10140a] transition hover:bg-[#d8ff83]"
          >
            <Search size={16} />
            Search
          </button>
        </form>

        {/* Search results */}
        {searchError ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-16 text-center">
            <h2 className="text-xl font-bold">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-white/45">
              We couldn&apos;t retrieve movie results. Please try again.
            </p>
          </div>
        ) : !query ? (
          <div className="rounded-2xl border border-white/[.07] bg-[#111620] px-6 py-20 text-center">
            <Clapperboard
              size={38}
              className="mx-auto text-[#c7f36b]"
            />
            <h2 className="mt-5 text-xl font-bold">
              What would you like to watch?
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Enter a movie title in the search bar above.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#c7f36b]">
                  SEARCH RESULTS
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Results for &ldquo;{query}&rdquo;
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  {results.totalResults.toLocaleString()} movies found
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/35">
                <SlidersHorizontal size={14} />
                Sorted by relevance
              </div>
            </div>

            {results.movies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {results.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Pagination */}
                {results.totalPages > 1 && (
                  <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
                    {currentPage > 1 && (
                      <Link
                        href={pageUrl(currentPage - 1)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-[#c7f36b] hover:text-[#c7f36b]"
                      >
                        <ArrowLeft size={15} />
                        Previous
                      </Link>
                    )}

                    <span className="px-3 text-sm text-white/45">
                      Page {currentPage} of {results.totalPages}
                    </span>

                    {currentPage < results.totalPages && (
                      <Link
                        href={pageUrl(currentPage + 1)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-[#c7f36b] hover:text-[#c7f36b]"
                      >
                        Next
                        <ArrowRight size={15} />
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-white/[.07] bg-[#111620] px-6 py-20 text-center">
                <Search
                  size={38}
                  className="mx-auto text-white/25"
                />
                <h2 className="mt-5 text-xl font-bold">
                  No movies found
                </h2>
                <p className="mt-2 text-sm text-white/40">
                  Try another title or check your spelling.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <footer className="border-t border-white/[.07] py-8">
        <div className="page-shell text-center text-xs text-white/30">
          Movie information and images provided by TMDB.
        </div>
      </footer>
    </main>
  );
}
