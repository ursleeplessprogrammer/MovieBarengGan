
export type VideoSource = {
  id: string;
  name: string;
  kind: "mp4" | "iframe";
  url: string;
  license: string;
  attribution: string;
  sourcePage: string;
};

// Optional manually registered movie sources.
// Registered sources take priority over VixSrc.
const movieVideoSources: Record<number, VideoSource[]> = {
  // Example:
  // 550: [
  //   {
  //     id: "custom-mp4",
  //     name: "Custom Server",
  //     kind: "mp4",
  //     url: "https://your-domain.com/movie.mp4",
  //     license: "Authorized content",
  //     attribution: "Your provider",
  //     sourcePage: "https://your-domain.com/",
  //   },
  // ],
};

// Optional manually registered episode sources.
// Key format: "showId-seasonNumber-episodeNumber"
const episodeVideoSources: Record<string, VideoSource[]> = {};

// VixSrc configuration
const VIXSRC_BASE_URL = "https://vixsrc.to";

const VIXSRC_EMBED_PARAMS = {
  primaryColor: "C7F36B",
  secondaryColor: "20251A",
  autoplay: "false",
};

// Build a VixSrc movie URL.
function buildVixSrcMovieUrl(movieId: number): string {
  const url = new URL(
    `/movie/${movieId}`,
    VIXSRC_BASE_URL
  );

  url.search = new URLSearchParams(VIXSRC_EMBED_PARAMS).toString();

  return url.toString();
}

// Build a VixSrc TV episode URL.
function buildVixSrcEpisodeUrl(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
): string {
  const url = new URL(
    `/tv/${showId}/${seasonNumber}/${episodeNumber}`,
    VIXSRC_BASE_URL
  );

  url.search = new URLSearchParams(VIXSRC_EMBED_PARAMS).toString();

  return url.toString();
}

// Basic ID validation.
function isValidId(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

// VixSrc movie player.
function getMovieProviderSources(movieId: number): VideoSource[] {
  if (!isValidId(movieId)) {
    return [];
  }

  return [
    {
      id: "vixsrc",
      name: "VixSrc",
      kind: "iframe",
      url: buildVixSrcMovieUrl(movieId),
      license: "Third-party provider — authorization not verified",
      attribution: "VixSrc",
      sourcePage: VIXSRC_BASE_URL,
    },
  ];
}

// VixSrc TV episode player.
function getEpisodeProviderSources(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
): VideoSource[] {
  if (
    !isValidId(showId) ||
    !Number.isInteger(seasonNumber) ||
    seasonNumber < 0 ||
    !Number.isInteger(episodeNumber) ||
    episodeNumber < 1
  ) {
    return [];
  }

  return [
    {
      id: "vixsrc",
      name: "VixSrc",
      kind: "iframe",
      url: buildVixSrcEpisodeUrl(
        showId,
        seasonNumber,
        episodeNumber
      ),
      license: "Third-party provider — authorization not verified",
      attribution: "VixSrc",
      sourcePage: VIXSRC_BASE_URL,
    },
  ];
}

// Movies
export function getMovieVideoSources(movieId: number): VideoSource[] {
  return movieVideoSources[movieId]?.length
    ? movieVideoSources[movieId]
    : getMovieProviderSources(movieId);
}

export function getMovieVideoSource(movieId: number): VideoSource | null {
  return getMovieVideoSources(movieId)[0] ?? null;
}

// TV episodes
export function getEpisodeVideoSources(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
): VideoSource[] {
  const key = `${showId}-${seasonNumber}-${episodeNumber}`;

  return episodeVideoSources[key]?.length
    ? episodeVideoSources[key]
    : getEpisodeProviderSources(
        showId,
        seasonNumber,
        episodeNumber
      );
}

export function getEpisodeVideoSource(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
): VideoSource | null {
  return (
    getEpisodeVideoSources(showId, seasonNumber, episodeNumber)[0] ?? null
  );
}
