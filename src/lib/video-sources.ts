
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
// These take priority over VixSrc.
const movieVideoSources: Record<number, VideoSource[]> = {
  // Example:
  // 10378: [
  //   {
  //     id: "custom-mp4",
  //     name: "Custom Video",
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
const episodeVideoSources: Record<string, VideoSource[]> = {
  // Example:
  // "60625-9-1": [],
};

// VixSrc movie provider
function getMovieProviderSources(movieId: number): VideoSource[] {
  return [
    {
      id: "vixsrc",
      name: "VixSrc",
      kind: "iframe",
      url: `https://vixsrc.to/movie/${movieId}`,
      license: "Third-party provider — authorization not verified",
      attribution: "VixSrc",
      sourcePage: "https://vixsrc.to/",
    },
  ];
}

// VixSrc TV episode provider
function getEpisodeProviderSources(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
): VideoSource[] {
  return [
    {
      id: "vixsrc",
      name: "VixSrc",
      kind: "iframe",
      url: `https://vixsrc.to/tv/${showId}/${seasonNumber}/${episodeNumber}`,
      license: "Third-party provider — authorization not verified",
      attribution: "VixSrc",
      sourcePage: "https://vixsrc.to/",
    },
  ];
}

// Movies
export function getMovieVideoSources(movieId: number): VideoSource[] {
  const registeredSources = movieVideoSources[movieId];

  if (registeredSources?.length) {
    return registeredSources;
  }

  return getMovieProviderSources(movieId);
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
  const registeredSources = episodeVideoSources[key];

  if (registeredSources?.length) {
    return registeredSources;
  }

  return getEpisodeProviderSources(
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
