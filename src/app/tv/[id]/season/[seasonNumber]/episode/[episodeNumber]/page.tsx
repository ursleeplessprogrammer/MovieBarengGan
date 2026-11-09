import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Star,
  Tv,
} from "lucide-react";

import { Header } from "@/components/header";
import {
  getTVEpisodeDetails,
  getTVShowDetails,
  TMDBNotFoundError,
} from "@/lib/tmdb";

type EpisodePageProps = {
  params: Promise<{
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  }>;
};

export default async function EpisodePage({
  params,
}: EpisodePageProps) {
  const { id, seasonNumber, episodeNumber } = await params;

  const showId = Number(id);
  const season = Number(seasonNumber);
  const episode = Number(episodeNumber);

  if (
    !Number.isSafeInteger(showId) ||
    showId <= 0 ||
    !Number.isSafeInteger(season) ||
    season < 0 ||
    !Number.isSafeInteger(episode) ||
    episode <= 0
  ) {
    notFound();
  }

  let showData: Awaited<ReturnType<typeof getTVShowDetails>>;
  let episodeData: Awaited<ReturnType<typeof getTVEpisodeDetails>>;

  try {
    [showData, episodeData] = await Promise.all([
      getTVShowDetails(showId),
      getTVEpisodeDetails(showId, season, episode),
    ]);
  } catch (error) {
    if (error instanceof TMDBNotFoundError) {
      notFound();
    }

    throw error;
  }

  const still = episodeData.still_path
    ? `https://image.tmdb.org/t/p/original${episodeData.still_path}`
    : null;

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        <Link
          href={`/tv/${showId}/season/${season}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c7f36b]"
        >
          <ArrowLeft size={15} />
          Back to {episodeData.season_number === 0 ? "Specials" : `Season ${season}`}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
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

            <div className="mt-7">
              <p className="text-xs font-bold tracking-[0.15em] text-[#c7f36b]">
                {showData.show.name.toUpperCase()}
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                {episodeData.name}
              </h1>

              <p className="mt-3 text-sm text-white/45">
                Season {season} · Episode {episode}
              </p>

              <p className="mt-6 text-sm leading-7 text-white/60">
                {episodeData.overview ||
                  "No episode description is available."}
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/[.08] bg-[#111620] p-6">
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
                <span className="text-white/40">Episode rating</span>
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