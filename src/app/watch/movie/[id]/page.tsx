
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { VideoPlayer } from "@/components/video-player";
import { getMoviePageData, TMDBNotFoundError } from "@/lib/tmdb";
import { getMovieVideoSource } from "@/lib/video-sources";

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

  if (!Number.isInteger(movieId) || movieId <= 0) {
    notFound();
  }

  let movieData;

  try {
    movieData = await getMoviePageData(movieId);
  } catch (error) {
    if (error instanceof TMDBNotFoundError) {
      notFound();
    }

    throw error;
  }

  const { movie } = movieData;
  const videoSource = getMovieVideoSource(movieId);

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        <Link
          href={`/movie/${movieId}`}
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#c7f36b]"
        >
          <ArrowLeft size={16} />
          Back to movie details
        </Link>

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

        <VideoPlayer
          src={videoSource?.url ?? ""}
          poster={movie.backdrop || movie.poster}
          title={movie.title}
        />

        {videoSource && (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-bold text-white">
              Video attribution
            </p>

            <p className="mt-2 text-sm text-white/60">
              {videoSource.attribution}
            </p>

            <p className="mt-1 text-xs text-white/40">
              License: {videoSource.license}
            </p>

            <a
              href={videoSource.sourcePage}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#c7f36b] hover:underline"
            >
              View license information
              <ExternalLink size={13} />
            </a>
          </div>
        )}

        <div className="mt-8 max-w-3xl">
          <h2 className="text-lg font-bold">About this movie</h2>

          <p className="mt-3 text-sm leading-7 text-white/55">
            {movie.description}
          </p>
        </div>
      </section>
    </main>
  );
}
