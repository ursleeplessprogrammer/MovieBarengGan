import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clapperboard,
  Play,
  Star,
  Tv,
} from "lucide-react";

import { Header } from "@/components/header";
import { TVShowCard } from "@/components/tv-show-card";
import {
  getTVShowDetails,
  TMDBNotFoundError,
} from "@/lib/tmdb";

type TVDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TVDetailPage({
  params,
}: TVDetailPageProps) {
  const { id } = await params;
  const showId = Number(id);

  if (!Number.isSafeInteger(showId) || showId <= 0) {
    notFound();
  }

  let data: Awaited<ReturnType<typeof getTVShowDetails>>;

  try {
    data = await getTVShowDetails(showId);
  } catch (error) {
    if (error instanceof TMDBNotFoundError) {
      notFound();
    }

    throw error;
  }

  const { show, seasons, creators, cast, trailer, recommendations, totalEpisodes } =
    data;

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[570px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${show.backdrop}")` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#090c12] via-[#090c12]/85 to-[#090c12]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090c12] via-transparent to-[#090c12]/30" />

        <div className="page-shell relative z-10 flex min-h-[570px] items-end pb-14 pt-36">
          <div className="max-w-3xl">
            <Link
              href="/tv"
              className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#c7f36b]"
            >
              <ArrowLeft size={15} />
              Back to TV shows
            </Link>

            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
              MOVIEBARENGGAN ORIGINAL DISCOVERY
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              {show.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/65">
              <span className="flex items-center gap-1.5">
                <Star
                  size={15}
                  fill="#c7f36b"
                  className="text-[#c7f36b]"
                />
                {show.rating}
              </span>

              {show.year > 0 && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  {show.year}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Tv size={15} />
                {show.seasons} seasons
              </span>

              <span>{totalEpisodes} episodes</span>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              {show.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {show.genre.split(" · ").map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/65"
                >
                  {genre}
                </span>
              ))}
            </div>

            {trailer && (
              <a
                href={trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-6 py-3 text-sm font-black text-[#10140a] transition hover:bg-[#d8ff83]"
              >
                <Play size={16} fill="currentColor" />
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="page-shell space-y-16 pb-20">
        {/* Show information */}
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-xl border border-white/10">
            <Image
              src={show.poster}
              alt={`${show.name} poster`}
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black">
              About the <span className="text-[#c7f36b]">Series</span>
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-white/40">STATUS</p>
                <p className="mt-1 font-semibold">{show.status}</p>
              </div>

              <div>
                <p className="text-xs text-white/40">TOTAL SEASONS</p>
                <p className="mt-1 font-semibold">{show.seasons}</p>
              </div>

              <div>
                <p className="text-xs text-white/40">TOTAL EPISODES</p>
                <p className="mt-1 font-semibold">{totalEpisodes}</p>
              </div>

              <div>
                <p className="text-xs text-white/40">CREATED BY</p>
                <p className="mt-1 font-semibold">
                  {creators.length > 0
                    ? creators.map((creator) => creator.name).join(", ")
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seasons */}
        <div>
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.15em] text-[#c7f36b]">
              EXPLORE THE STORY
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Seasons & Episodes
            </h2>
          </div>

          <div className="space-y-4">
            {seasons
              .filter((season) => season.season_number >= 0)
              .map((season) => (
                <Link
                  key={season.id}
                  href={`/tv/${show.id}/season/${season.season_number}`}
                  className="group flex items-center gap-5 rounded-2xl border border-white/[.08] bg-[#111620] p-4 transition hover:border-[#c7f36b]/40"
                >
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-[#202735]">
                    {season.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                        alt={season.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <Clapperboard className="text-white/30" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold transition group-hover:text-[#c7f36b]">
                      {season.name}
                    </h3>

                    <p className="mt-2 text-xs text-white/45">
                      {season.episode_count} episodes
                      {season.air_date
                        ? ` · ${season.air_date.slice(0, 4)}`
                        : ""}
                    </p>

                    {season.overview && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/40">
                        {season.overview}
                      </p>
                    )}
                  </div>

                  <ArrowLeft
                    size={18}
                    className="shrink-0 rotate-180 text-white/35 transition group-hover:text-[#c7f36b]"
                  />
                </Link>
              ))}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div>
            <h2 className="mb-7 text-2xl font-black">
              Main <span className="text-[#c7f36b]">Cast</span>
            </h2>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cast.map((person) => (
                <div key={person.id} className="min-w-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#171c25]">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                        alt={person.name}
                        fill
                        sizes="(max-width: 640px) 45vw, 180px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <Tv className="text-white/25" size={28} />
                      </div>
                    )}
                  </div>

                  <p className="mt-3 truncate text-sm font-bold">
                    {person.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-white/40">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="mb-7 text-2xl font-black">
              You May Also <span className="text-[#c7f36b]">Like</span>
            </h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {recommendations.map((item) => (
                <TVShowCard key={item.id} show={item} />
              ))}
            </div>
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