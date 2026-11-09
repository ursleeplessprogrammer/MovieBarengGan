import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Play } from "lucide-react";

import { Header } from "@/components/header";
import {
  getTVSeasonDetails,
  getTVShowDetails,
  TMDBNotFoundError,
} from "@/lib/tmdb";

type SeasonPageProps = {
  params: Promise<{
    id: string;
    seasonNumber: string;
  }>;
};

export default async function SeasonPage({
  params,
}: SeasonPageProps) {
  const { id, seasonNumber } = await params;
  const showId = Number(id);
  const season = Number(seasonNumber);

  if (
    !Number.isSafeInteger(showId) ||
    showId <= 0 ||
    !Number.isSafeInteger(season) ||
    season < 0
  ) {
    notFound();
  }

  let showData: Awaited<ReturnType<typeof getTVShowDetails>>;
  let seasonData: Awaited<ReturnType<typeof getTVSeasonDetails>>;

  try {
    [showData, seasonData] = await Promise.all([
      getTVShowDetails(showId),
      getTVSeasonDetails(showId, season),
    ]);
  } catch (error) {
    if (error instanceof TMDBNotFoundError) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      <section className="page-shell pb-20 pt-32">
        <Link
          href={`/tv/${showId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c7f36b]"
        >
          <ArrowLeft size={15} />
          Back to {showData.show.name}
        </Link>

        <p className="text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
          {showData.show.name.toUpperCase()}
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-5xl">
          {seasonData.name}
        </h1>

        <p className="mt-3 text-sm text-white/45">
          {seasonData.episodes.length} episodes
        </p>

        <div className="mt-10 space-y-5">
          {seasonData.episodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/tv/${showId}/season/${season}/episode/${episode.episode_number}`}
              className="group grid gap-4 rounded-2xl border border-white/[.08] bg-[#111620] p-4 transition hover:border-[#c7f36b]/40 sm:grid-cols-[220px_1fr_auto]"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl bg-[#202735]">
                {episode.still_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={episode.name}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-white/25">
                    <Play size={28} />
                  </div>
                )}
              </div>

              <div className="min-w-0 self-center">
                <p className="text-xs font-bold text-[#c7f36b]">
                  EPISODE {episode.episode_number}
                </p>

                <h2 className="mt-2 text-lg font-bold transition group-hover:text-[#c7f36b]">
                  {episode.name}
                </h2>

                <p className="mt-2 flex items-center gap-2 text-xs text-white/40">
                  <CalendarDays size={13} />
                  {episode.air_date || "Release date unavailable"}
                  {episode.runtime ? ` · ${episode.runtime} min` : ""}
                </p>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">
                  {episode.overview || "No episode description available."}
                </p>
              </div>

              <div className="hidden items-center sm:flex">
                <ArrowRight
                  size={19}
                  className="text-white/30 transition group-hover:text-[#c7f36b]"
                />
              </div>
            </Link>
          ))}
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