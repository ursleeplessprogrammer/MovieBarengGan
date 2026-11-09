
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { VideoPlayer } from "@/components/video-player";
import {
  getMoviePageData,
  TMDBNotFoundError,
} from "@/lib/tmdb";
import { getMovieVideoSources } from "@/lib/video-sources";

type WatchMoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WatchMoviePage({
  params,
}: WatchMoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    notFound();
  }

  let movieData: Awaited<ReturnType<typeof getMoviePageData>>;

  try {
    movieData = await getMoviePageData(movieId);
  } catch (error) {
    if (error instanceof TMDBNotFoundError) {
      notFound();
    }

    throw error;
  }

  const { movie } = movieData;

  const videoSources = getMovieVideoSources(movieId);

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        {/* Back navigation */}
        <Link
          href={`/movie/${movieId}`}
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#c7f36b]"
        >
          <ArrowLeft size={16} />
          Back to movie details
        </Link>

        {/* Movie information */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c7f36b]">
            Now playing
          </p>

          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            {movie.title}
          </h1>

          <p className="mt-2 text-sm text-white/50">
            {movie.year} · {movie.genre}
          </p>
        </div>

        {/* Video player */}
        {videoSources.length > 0 ? (
          <VideoPlayer
            sources={videoSources}
            poster={movie.backdrop || movie.poster}
            title={movie.title}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111620]">
            <div className="relative aspect-video">
              {movie.backdrop || movie.poster ? (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 blur-sm"
                  style={{
                    backgroundImage: `url("${movie.backdrop || movie.poster}")`,
                  }}
                />
              ) : null}

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-6 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/[.08] text-white/60">
                  <ArrowLeft size={22} />
                </div>

                <h2 className="mt-5 text-lg font-bold">
                  Streaming unavailable
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                  No authorized video source is currently registered
                  for this movie. Please check back later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Movie description */}
        <div className="mt-8 max-w-3xl">
          <h2 className="text-lg font-bold">
            About this movie
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/55">
            {movie.description}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[.07] py-8">
        <div className="page-shell text-center text-xs text-white/30">
          Movie information and images provided by TMDB.
        </div>
      </footer>
    </main>
  );
}
