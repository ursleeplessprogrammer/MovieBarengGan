
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, Tv, X } from "lucide-react";

import { Header } from "@/components/header";
import { TVShowCard } from "@/components/tv-show-card";
import {
  getPopularTVShows,
  searchTVShows,
} from "@/lib/tmdb";

type TVPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};

export default async function TVPage({
  searchParams,
}: TVPageProps) {
  const params = await searchParams;

  const query = (params.q ?? "").trim();
  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0
      ? Math.min(requestedPage, 500)
      : 1;

  let results: Awaited<ReturnType<typeof getPopularTVShows>> = {
    shows: [],
    totalPages: 0,
    totalResults: 0,
  };

  let hasError = false;

  try {
    results = query
      ? await searchTVShows(query, page)
      : await getPopularTVShows(page);
  } catch (error) {
    console.error("Failed to retrieve TV shows from TMDB:", error);
    hasError = true;
  }

  const currentPage = Math.min(
    page,
    Math.max(1, results.totalPages),
  );

  const pageHref = (nextPage: number) => {
    const searchParams = new URLSearchParams();

    if (query) {
      searchParams.set("q", query);
    }

    searchParams.set("page", String(nextPage));

    return `/tv?${searchParams.toString()}`;
  };

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c7f36b]"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>

        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
            SERIES WORTH WATCHING
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Explore <span className="text-[#c7f36b]">TV Shows.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
            Discover popular series or search the TMDB database
            to find your next binge-worthy story.
          </p>
        </div>

        {/* TV SHOW SEARCH */}
        <form
          action="/tv"
          method="GET"
          className="mb-10 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-[#111620] p-2 transition focus-within:border-[#c7f36b]/50"
        >
          <Search
            size={19}
            className="ml-3 shrink-0 text-white/35"
          />

          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search any TV show..."
            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />

          <button
            type="submit"
            className="rounded-xl bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#090c12] transition hover:bg-[#d8ff83]"
          >
            Search
          </button>

          {query && (
            <Link
              href="/tv"
              aria-label="Clear search"
              className="mr-2 rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </Link>
          )}
        </form>

        {hasError ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-16 text-center">
            <h2 className="text-xl font-bold">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-white/45">
              We couldn&apos;t retrieve TV shows from TMDB.
              Please try again.
            </p>
          </div>
        ) : results.shows.length > 0 ? (
          <>
            <div className="mb-7">
              <p className="text-xs font-bold tracking-[0.15em] text-[#c7f36b]">
                {query ? "SEARCH RESULTS" : "POPULAR TV SHOWS"}
              </p>

              <p className="mt-2 text-sm text-white/40">
                {results.totalResults.toLocaleString()}{" "}
                {results.totalResults === 1 ? "show" : "shows"} found
                {query && (
                  <>
                    {" "}for <span className="text-white/70">&quot;{query}&quot;</span>
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {results.shows.map((show) => (
                <TVShowCard key={show.id} show={show} />
              ))}
            </div>

            {results.totalPages > 1 && (
              <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
                {currentPage > 1 && (
                  <Link
                    href={pageHref(currentPage - 1)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-[#c7f36b] hover:text-[#c7f36b]"
                  >
                    <ArrowLeft size={15} />
                    Previous
                  </Link>
                )}

                <span className="px-3 text-sm text-white/45">
                  Page {currentPage} of {Math.min(results.totalPages, 500)}
                </span>

                {currentPage < Math.min(results.totalPages, 500) && (
                  <Link
                    href={pageHref(currentPage + 1)}
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
            <Tv
              size={38}
              className="mx-auto text-white/25"
            />

            <h2 className="mt-5 text-xl font-bold">
              {query ? "No TV shows found" : "No TV shows available"}
            </h2>

            <p className="mt-2 text-sm text-white/40">
              {query
                ? `We couldn't find "${query}" in the TMDB database. Try another title.`
                : "Please try again later."}
            </p>

            {query && (
              <Link
                href="/tv"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#090c12] transition hover:bg-[#d8ff83]"
              >
                Browse popular shows
              </Link>
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-white/[.07] py-8">
        <div className="page-shell text-center text-xs text-white/30">
          TV show information and images provided by TMDB.
        </div>
      </footer>
    </main>
  );
}
