
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
// These take priority over automatically generated sources.
const movieVideoSources: Record<number, VideoSource[]> = {
  10378: [
    {
      id: "demo-mp4",
      name: "Demo MP4",
      kind: "mp4",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      license: "Verify license and hosting permissions before production",
      attribution: "Big Buck Bunny — Blender Foundation",
      sourcePage: "https://peach.blender.org/about/",
    },
  ],
};

// Optional manually registered episode sources.
const episodeVideoSources: Record<string, VideoSource[]> = {};

// Automatically generated provider sources.
// Only use providers that authorize your intended playback and embedding.

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
  return getEpisodeVideoSources(
    showId,
    seasonNumber,
    episodeNumber
  )[0] ?? null;
}
