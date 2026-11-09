export type VideoSource = {
  id: string;
  name: string;
  kind: "mp4" | "iframe";
  url: string;
  license: string;
  attribution: string;
  sourcePage: string;
};

const movieVideoSources: Record<number, VideoSource[]> = {
  // Big Buck Bunny — demo source for player integration
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

const episodeVideoSources: Record<string, VideoSource[]> = {};

export function getMovieVideoSources(movieId: number): VideoSource[] {
  return movieVideoSources[movieId] ?? [];
}

export function getMovieVideoSource(movieId: number): VideoSource | null {
  return getMovieVideoSources(movieId)[0] ?? null;
}

export function getEpisodeVideoSources(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
): VideoSource[] {
  const key = `${showId}-${seasonNumber}-${episodeNumber}`;
  return episodeVideoSources[key] ?? [];
}

export function getEpisodeVideoSource(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
): VideoSource | null {
  return getEpisodeVideoSources(showId, seasonNumber, episodeNumber)[0] ?? null;
}