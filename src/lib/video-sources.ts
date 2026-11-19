export type VideoSource = {
  id: string;
  name: string;
  kind: "mp4" | "iframe";
  url: string;
  license: string;
  attribution: string;
  sourcePage: string;
};

type ConfiguredSource = VideoSource & {
  movieId?: number;
  showId?: number;
  seasonNumber?: number;
  episodeNumber?: number;
};

function getConfiguredSources(): ConfiguredSource[] {
  const raw = process.env.MBG_VIDEO_SOURCES_JSON;
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is ConfiguredSource => {
      if (!value || typeof value !== "object") return false;
      const source = value as Record<string, unknown>;
      let mediaUrl: URL;
      let sourcePage: URL;
      try {
        mediaUrl = new URL(String(source.url ?? ""));
        sourcePage = new URL(String(source.sourcePage ?? ""));
      } catch {
        return false;
      }

      const movieTarget = Number.isSafeInteger(source.movieId) && Number(source.movieId) > 0;
      const episodeTarget =
        Number.isSafeInteger(source.showId) && Number(source.showId) > 0 &&
        Number.isSafeInteger(source.seasonNumber) && Number(source.seasonNumber) >= 0 &&
        Number.isSafeInteger(source.episodeNumber) && Number(source.episodeNumber) > 0;

      return (
        typeof source.id === "string" && source.id.trim().length > 0 &&
        typeof source.name === "string" && source.name.trim().length > 0 &&
        (source.kind === "mp4" || source.kind === "iframe") &&
        mediaUrl.protocol === "https:" && sourcePage.protocol === "https:" &&
        typeof source.license === "string" && source.license.trim().length > 0 &&
        typeof source.attribution === "string" && source.attribution.trim().length > 0 &&
        (movieTarget || episodeTarget)
      );
    });
  } catch {
    return [];
  }
}

export function getMovieVideoSources(movieId: number): VideoSource[] {
  if (!Number.isSafeInteger(movieId) || movieId <= 0) return [];
  return getConfiguredSources()
    .filter((source) => source.movieId === movieId)
    .map((source) => ({
      id: source.id,
      name: source.name,
      kind: source.kind,
      url: source.url,
      license: source.license,
      attribution: source.attribution,
      sourcePage: source.sourcePage,
    }));
}

export function getMovieVideoSource(movieId: number): VideoSource | null {
  return getMovieVideoSources(movieId)[0] ?? null;
}

export function getEpisodeVideoSources(
  showId: number,
  seasonNumber: number,
  episodeNumber: number,
): VideoSource[] {
  if (
    !Number.isSafeInteger(showId) || showId <= 0 ||
    !Number.isSafeInteger(seasonNumber) || seasonNumber < 0 ||
    !Number.isSafeInteger(episodeNumber) || episodeNumber <= 0
  ) return [];

  return getConfiguredSources()
    .filter((source) =>
      source.showId === showId &&
      source.seasonNumber === seasonNumber &&
      source.episodeNumber === episodeNumber
    )
    .map((source) => ({
      id: source.id,
      name: source.name,
      kind: source.kind,
      url: source.url,
      license: source.license,
      attribution: source.attribution,
      sourcePage: source.sourcePage,
    }));
}

export function getEpisodeVideoSource(
  showId: number,
  seasonNumber: number,
  episodeNumber: number,
): VideoSource | null {
  return getEpisodeVideoSources(showId, seasonNumber, episodeNumber)[0] ?? null;
}
