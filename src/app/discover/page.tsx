import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  SlidersHorizontal,
} from "lucide-react";

import { Header } from "@/components/header";
import { MovieCard } from "@/components/movie-card";
import {
  discoverMovies,
  getMovieGenres,
} from "@/lib/tmdb";

type DiscoverPageProps = {
  searchParams: Promise<{
    genre?: string;
    year?: string;
    sort?: string;
    page?: string;
  }>;
};

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Revenue" },
];

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const params = await searchParams;

  const genre = params.genre ?? "";
  const year = params.year ?? "";
  const sort = SORT_OPTIONS.some(
    (option) => option.value === params.sort,
  )
    ? params.sort!
    : "popularity.desc";

  const requestedPage = Number(params.page ?? "1");
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const genreId = /^\d+$/.test(genre) ? Number(genre) : undefined;
  const releaseYear = /^\d{4}$/.test(year)
    ? Number(year)
    : undefined;

  let genres: Awaited<ReturnType<typeof getMovieGenres>> = [];
  let results: Awaited<ReturnType<typeof discoverMovies>> = {
    movies: [],
    totalPages: 0,
    totalResults: 0,
  };

  let hasError = false;

  try {
    const [genreResults, movieResults] = await Promise.all([
      getMovieGenres(),
      discoverMovies(genreId, releaseYear, sort, page),
    ]);

    genres = genreResults;
    results = movieResults;
  } catch {
    hasError = true;
  }

  const currentPage = Math.min(
    page,
    Math.max(1, results.totalPages),
  );

  function pageUrl(nextPage: number) {
    const query = new URLSearchParams();

    if (genre) query.set("genre", genre);
    if (year) query.set("year", year);
    if (sort) query.set("sort", sort);

    query.set("page", String(nextPage));

    return `/discover?${query.toString()}`;
  }

  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        <div className="mb-10">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c7f36b]"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>

          <p className="text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
            EXPLORE THE COLLECTION
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Discover <span className="text-[#c7f36b]">movies.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
            Find your next favorite movie. Explore different genres,
            release years, and ratings.
          </p>
        </div>

        {/* Filters */}
        <form
          action="/discover"
          method="GET"
          className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label
              htmlFor="genre"
              className="mb-2 block text-xs font-bold text-white/50"
            >
              GENRE
            </label>

            <select
              id="genre"
              name="genre"
              defaultValue={genre}
              className="h-12 w-full rounded-xl border border-white/10 bg-[#111620] px-4 text-sm text-white outline-none focus:border-[#c7f36b]/60"
            >
              <option value="">All genres</option>

              {genres.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="year"
              className="mb-2 block text-xs font-bold text-white/50"
            >
              RELEASE YEAR
            </label>

            <select
              id="year"
              name="year"
              defaultValue={year}
              className="h-12 w-full rounded-xl border border-white/10 bg-[#111620] px-4 text-sm text-white outline-none focus:border-[#c7f36b]/60"
            >
              <option value="">All years</option>

              {Array.from(
                { length: currentYear - 1894 },
                (_, index) => currentYear - index,
              ).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort"
              className="mb-2 block text-xs font-bold text-white/50"
            >
              SORT BY
            </label>

            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="h-12 w-full rounded-xl border border-white/10 bg-[#111620] px-4 text-sm text-white outline-none focus:border-[#c7f36b]/60"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-5 text-sm font-black text-[#10140a] transition hover:bg-[#d8ff83]"
            >
              <SlidersHorizontal size={16} />
              Apply Filters
            </button>

            <Link
              href="/discover"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-white/60 transition hover:border-white/30 hover:text-white"
            >
              Reset
            </Link>
          </div>
        </form>

        {/* Results */}
        {hasError ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-16 text-center">
            <h2 className="text-xl font-bold">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-white/45">
              We couldn&apos;t retrieve movies. Please try again.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#c7f36b]">
                  MOVIE COLLECTION
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Explore movies
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  {results.totalResults.toLocaleString()} movies found
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/35">
                <Clapperboard size={14} />
                {SORT_OPTIONS.find(
                  (option) => option.value === sort,
                )?.label}
              </div>
            </div>

            {results.movies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {results.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

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
                <Clapperboard
                  size={38}
                  className="mx-auto text-white/25"
                />
                <h2 className="mt-5 text-xl font-bold">
                  No movies found
                </h2>
                <p className="mt-2 text-sm text-white/40">
                  Try changing your filters.
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