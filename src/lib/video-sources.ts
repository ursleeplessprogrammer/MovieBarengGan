
export type VideoSource = {
  url: string;
  type: "video/mp4";
  license: string;
  attribution: string;
  sourcePage: string;
};

const movieVideoSources: Record<number, VideoSource> = {
  // Big Buck Bunny — Blender Foundation
  // Demo stream for player integration and testing.
  10378: {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "video/mp4",
    license: "Creative Commons Attribution 3.0",
    attribution:
      "© 2008 Blender Foundation / www.bigbuckbunny.org",
    sourcePage: "https://peach.blender.org/about/",
  },
};

const episodeVideoSources: Record<string, VideoSource> = {};

export function getMovieVideoSource(
  movieId: number
): VideoSource | null {
  return movieVideoSources[movieId] ?? null;
}

export function getEpisodeVideoSource(
  showId: number,
  seasonNumber: number,
  episodeNumber: number
): VideoSource | null {
  const key = `${showId}-${seasonNumber}-${episodeNumber}`;
  return episodeVideoSources[key] ?? null;
}
