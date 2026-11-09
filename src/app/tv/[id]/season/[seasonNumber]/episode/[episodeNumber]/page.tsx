
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Star,
  Tv,
  Play,
} from "lucide-react";

import { Header } from "@/components/header";
import { VideoPlayer } from "@/components/video-player";
import {
  getTVEpisodeDetails,
  getTVShowDetails,
  TMDBNotFoundError,
} from "@/lib/tmdb";
import { getEpisodeVideoSources } from "@/lib/video-sources";

type EpisodePageProps = {
  params: Promise<{
    id: string;
    season: string;
    episode: string;
  }>;
};

export default async function WatchEpisodePage({
  params,
}: EpisodePageProps) {
  const { id, season, episode } = await params;

  const showId = Number(id);
  const seasonNumber = Number(season);
  const episodeNumber = Number(episode);

  if (
    !Number.isSafeInteger(showId) ||
    showId <= 0 ||
    !Number.isSafeInteger(seasonNumber) ||
    seasonNumber < 0 ||
    !Number.isSafeInteger(episodeNumber) ||
    episodeNumber <= 0
  ) {
    notFound();
  }

  let showData: Awaited<ReturnType<typeof getTVShowDetails>>;
  let episodeData: Awaited<ReturnType<typeof getTVEpisodeDetails>>;

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

  const still = episodeData.still_path
    ? `https://image.tmdb.org/t/p/original${episodeData.still_path}`
    : undefined;

  const videoSources = getEpisodeVideoSources(
    showId,
    seasonNumber,
    episodeNumber
  );

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        {/* Back navigation */}
        <Link
          href={`/tv/${showId}/season/${seasonNumber}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c7f36b]"
        >
          <ArrowLeft size={15} />
          Back to{" "}
          {episodeData.season_number === 0
            ? "Specials"
            : `Season ${seasonNumber}`}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {/* Episode thumbnail */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#171c25]">
              {still ? (
                <Image
                  src={still}
                  alt={episodeData.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <Tv size={48} className="text-white/25" />
                </div>
              )}
            </div>

            {/* Episode details */}
            <div className="mt-7">
              <p className="text-xs font-bold tracking-[0.15em] text-[#c7f36b]">
                {showData.show.name.toUpperCase()}
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                {episodeData.name}
              </h1>

              <p className="mt-3 text-sm text-white/45">
                Season {seasonNumber} · Episode {episodeNumber}
              </p>

              <p className="mt-6 text-sm leading-7 text-white/60">
                {episodeData.overview ||
                  "No episode description is available."}
              </p>

              {/* Video player */}
              <div className="mt-8">
                {videoSources.length > 0 ? (
                  <VideoPlayer
                    sources={videoSources}
                    poster={still}
                    title={episodeData.name}
                  />
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/[.03] p-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/[.06] text-white/50">
                        <Play size={17} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold">
                          Streaming unavailable
                        </h3>

                        <p className="mt-1 text-xs text-white/40">
                          No authorized video source is registered
                          for this episode.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Series information */}
          <aside className="h-fit rounded-2xl border border-white/[.08] bg-[#111620] p-6">
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[190px] overflow-hidden rounded-xl">
              <Image
                src={showData.show.poster}
                alt={`${showData.show.name} poster`}
                fill
                sizes="190px"
                className="object-cover"
              />
            </div>

            <h2 className="mt-6 text-center text-xl font-black">
              {showData.show.name}
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/40">
                  Episode rating
                </span>

                <span className="flex items-center gap-1 font-bold">
                  <Star
                    size={14}
                    fill="#c7f36b"
                    className="text-[#c7f36b]"
                  />

                  {episodeData.vote_average
                    ? episodeData.vote_average.toFixed(1)
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-white/40">Air date</span>

                <span className="flex items-center gap-1 font-semibold">
                  <CalendarDays size={14} />
                  {episodeData.air_date || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-white/40">Runtime</span>

                <span className="flex items-center gap-1 font-semibold">
                  <Clock size={14} />

                  {episodeData.runtime
                    ? `${episodeData.runtime} min`
                    : "N/A"}
                </span>
              </div>
            </div>

            <Link
              href={`/tv/${showId}`}
              className="mt-7 flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-bold transition hover:border-[#c7f36b] hover:text-[#c7f36b]"
            >
              View Series Details
            </Link>
          </aside>
        </div>
      </section>

      <footer className="border-t border-white/[.07] py-8">
        <div className="page-shell text-center text-xs text-white/30">
          TV show information and images provided by TMDB.
        </div>
      </footer>
    </main>
  );
}
