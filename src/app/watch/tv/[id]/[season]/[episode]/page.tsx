
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { VideoPlayer } from "@/components/video-player";
import {
  getTVEpisodeDetails,
  getTVShowDetails,
  TMDBNotFoundError,
} from "@/lib/tmdb";
import { getEpisodeVideoSource } from "@/lib/video-sources";

type WatchEpisodePageProps = {
  params: Promise<{
    id: string;
    season: string;
    episode: string;
  }>;
};

export default async function WatchEpisodePage({
  params,
}: WatchEpisodePageProps) {
  const { id, season, episode } = await params;

  const showId = Number(id);
  const seasonNumber = Number(season);
  const episodeNumber = Number(episode);

  if (
    !Number.isInteger(showId) ||
    !Number.isInteger(seasonNumber) ||
    !Number.isInteger(episodeNumber) ||
    showId <= 0 ||
    seasonNumber < 0 ||
    episodeNumber <= 0
  ) {
    notFound();
  }

  let showData;
  let episodeData;

  try {
    [showData, episodeData] = await Promise.all([
      getTVShowDetails(showId),
      getTVEpisodeDetails(showId, seasonNumber, episodeNumber),
    ]);
  } catch (error) {
    if (error instanceof TMDBNotFoundError) {
      notFound();
    }

    throw error;
  }

  const show = showData.show;
  const videoSource = getEpisodeVideoSource(
    showId,
    seasonNumber,
    episodeNumber
  );

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        <Link
          href={`/tv/${showId}/season/${seasonNumber}`}
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#c7f36b]"
        >
          <ArrowLeft size={16} />
          Back to episodes
        </Link>

        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c7f36b]">
            {show.name}
          </p>

          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            {episodeData.name}
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Season {seasonNumber} · Episode {episodeNumber}
          </p>
        </div>

        <VideoPlayer
          src={videoSource?.url ?? ""}
          poster={
            episodeData.still_path
              ? `https://image.tmdb.org/t/p/w1280${episodeData.still_path}`
              : undefined
          }
          title={episodeData.name}
        />

        {videoSource && (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-bold">Video attribution</p>

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
              className="mt-3 inline-block text-xs font-bold text-[#c7f36b] hover:underline"
            >
              View license information
            </a>
          </div>
        )}

        <div className="mt-8 max-w-3xl">
          <h2 className="text-lg font-bold">Episode overview</h2>

          <p className="mt-3 text-sm leading-7 text-white/55">
            {episodeData.overview || "No episode description available."}
          </p>
        </div>
      </section>
    </main>
  );
}
