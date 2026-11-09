import Link from "next/link";
import { ArrowLeft, ArrowRight, Tv } from "lucide-react";

import { Header } from "@/components/header";
import { TVShowCard } from "@/components/tv-show-card";
import { getPopularTVShows } from "@/lib/tmdb";

type TVPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function TVPage({
  searchParams,
}: TVPageProps) {
  const params = await searchParams;
  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  let results: Awaited<ReturnType<typeof getPopularTVShows>> = {
    shows: [],
    totalPages: 0,
    totalResults: 0,
  };

  let hasError = false;

  try {
    results = await getPopularTVShows(page);
  } catch {
    hasError = true;
  }

  const currentPage = Math.min(
    page,
    Math.max(1, results.totalPages),
  );

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

        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
            SERIES WORTH WATCHING
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Explore <span className="text-[#c7f36b]">TV Shows.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
            Discover popular series, explore their seasons, and
            find your next binge-worthy story.
          </p>
        </div>

        {hasError ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-16 text-center">
            <h2 className="text-xl font-bold">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-white/45">
              We couldn&apos;t retrieve TV shows. Please try again.
            </p>
          </div>
        ) : results.shows.length > 0 ? (
          <>
            <div className="mb-7">
              <p className="text-xs font-bold tracking-[0.15em] text-[#c7f36b]">
                POPULAR TV SHOWS
              </p>

              <p className="mt-2 text-sm text-white/40">
                {results.totalResults.toLocaleString()} shows found
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
                    href={`/tv?page=${currentPage - 1}`}
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
                    href={`/tv?page=${currentPage + 1}`}
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
            <Tv size={38} className="mx-auto text-white/25" />
            <h2 className="mt-5 text-xl font-bold">
              No TV shows found
            </h2>
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