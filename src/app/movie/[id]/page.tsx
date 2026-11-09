
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Play,
  Star,
  UserRound,
} from "lucide-react";

import { Header } from "@/components/header";
import { MovieCard } from "@/components/movie-card";
import {
  getMoviePageData,
  TMDBNotFoundError,
} from "@/lib/tmdb";
import { getMovieVideoSource } from "@/lib/video-sources";
import { notFound } from "next/navigation";

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    notFound();
  }

  let data;

  try {
    data = await getMoviePageData(movieId);
  } catch (error) {
    if (error instanceof TMDBNotFoundError) {
      notFound();
    }

    throw error;
  }

  const { movie, director, cast, trailerUrl, recommendations } = data;
  const videoSource = getMovieVideoSource(movieId);

  return (
    <main className="min-h-screen overflow-hidden bg-[#090c12] text-white">
      <Header />

      {/* Hero backdrop */}
      <section className="relative min-h-[720px]">
        {movie.backdrop && (
          <Image
            src={movie.backdrop}
            alt={`${movie.title} backdrop`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#090c12] via-[#090c12]/85 to-[#090c12]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090c12] via-[#090c12]/25 to-[#090c12]/50" />

        <div className="page-shell relative z-10 flex min-h-[720px] flex-col justify-end pb-16 pt-32">
          <Link
            href="/#movies"
            className="mb-10 flex w-fit items-center gap-2 text-sm text-white/55 transition hover:text-[#c7f36b]"
          >
            <ArrowLeft size={16} />
            Back to movies
          </Link>

          <div className="grid items-end gap-10 md:grid-cols-[220px_1fr] lg:gap-14">
            {/* Poster */}
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 md:mx-0">
              <Image
                src={movie.poster}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 768px) 60vw, 220px"
                className="object-cover"
              />
            </div>

            {/* Movie information */}
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c7f36b]/25 bg-[#c7f36b]/10 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] text-[#c7f36b]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
                MOVIE DETAILS
              </span>

              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
                {movie.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  {movie.year || "Release date unavailable"}
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={15} />
                  {movie.runtime}
                </span>

                <span className="flex items-center gap-2 text-[#c7f36b]">
                  <Star size={15} fill="currentColor" />
                  {movie.rating}
                  <span className="text-white/40">/ 10</span>
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genre.split(" · ").map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-xs text-white/75"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                {movie.description}
              </p>

              <div className="mt-7 grid gap-2 text-sm sm:grid-cols-2">
                <div className="text-white/45">
                  <span className="block text-[10px] font-bold tracking-[0.15em] text-white/30">
                    DIRECTOR
                  </span>

                  <span className="mt-1 block font-semibold text-white/85">
                    {director}
                  </span>
                </div>
              </div>

              {/* Movie actions */}
              <div className="mt-9 flex flex-wrap gap-3">
                {videoSource && (
                  <Link
                    href={`/watch/movie/${movie.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-6 py-3.5 text-sm font-black text-[#10140a] transition hover:bg-[#d8ff83]"
                  >
                    <Play size={16} fill="currentColor" />
                    Watch Movie
                  </Link>
                )}

                {trailerUrl ? (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#c7f36b]/50 hover:text-[#c7f36b]"
                  >
                    <Play size={16} />
                    Watch trailer
                    <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-6 py-3.5 text-sm text-white/45">
                    Trailer unavailable
                  </span>
                )}

                <button
                  type="button"
                  disabled
                  title="Watchlist will be available after account features are implemented."
                  className="cursor-not-allowed rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white/40"
                >
                  + Add to watchlist
                </button>
              </div>

              {!videoSource && (
                <p className="mt-3 text-xs text-white/35">
                  Streaming is currently unavailable for this title.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cast */}
      <section className="page-shell py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
              THE PEOPLE BEHIND IT
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Cast & Crew
            </h2>
          </div>

          <span className="text-xs text-white/35">
            {cast.length} cast members
          </span>
        </div>

        {cast.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cast.map((person) => (
              <div
                key={person.id}
                className="overflow-hidden rounded-xl border border-white/[.07] bg-[#111620]"
              >
                <div className="relative aspect-[3/4] bg-[#1a202c]">
                  {person.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                      alt={person.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 180px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20">
                      <UserRound size={42} />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="truncate text-sm font-bold">
                    {person.name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-white/40">
                    {person.character || "Cast member"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/40">
            Cast information is not available.
          </p>
        )}
      </section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="page-shell border-t border-white/[.07] py-16">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
              KEEP DISCOVERING
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              You Might Also Like
            </h2>

            <p className="mt-2 text-sm text-white/40">
              More movies selected based on this title.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recommendations.map((recommendedMovie) => (
              <MovieCard
                key={recommendedMovie.id}
                movie={recommendedMovie}
              />
            ))}
          </div>
        </section>
      )}

      {/* TMDB attribution */}
      <footer className="border-t border-white/[.07] py-8">
        <div className="page-shell flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/35">
            Movie information and images provided by TMDB.
          </p>

          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-white/50 transition hover:text-[#c7f36b]"
          >
            Visit TMDB <ArrowUpRight size={12} className="inline" />
          </a>
        </div>

        <p className="page-shell mt-3 text-center text-[10px] text-white/25">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </footer>
    </main>
  );
}
