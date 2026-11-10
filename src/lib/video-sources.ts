
export type VideoSource = {
  id: string;
  name: string;
  kind: "mp4" | "iframe";
  url: string;
  license: string;
  attribution: string;
  sourcePage: string;
};

// Manually registered movie sources.
// Add only video sources you are authorized to use.
const movieVideoSources: Record<number, VideoSource[]> = {
  // Example movie:
  // 10378: [
  //   {
  //     id: "demo-mp4",
  //     name: "Demo MP4",
  //     kind: "mp4",
  //     url: "https://your-domain.com/videos/movie.mp4",
  //     license: "Authorized video content",
  //     attribution: "Your content provider",
  //     sourcePage: "https://your-domain.com",
  //   },
  // ],
};

// Manually registered TV episode sources.
// Key format: "showId-seasonNumber-episodeNumber"
const episodeVideoSources: Record<string, VideoSource[]> = {
  // Example:
  // "60625-9-1": [
  //   {
  //     id: "episode-mp4",
  //     name: "Episode Server",
  //     kind: "mp4",
  //     url: "https://your-domain.com/videos/episode.mp4",
  //     license: "Authorized video content",
  //     attribution: "Your content provider",
  //     sourcePage: "https://your-domain.com",
  //   },
  // ],
};

// Movie sources
export function getMovieVideoSources(movieId: number): VideoSource[] {
  return movieVideoSources[movieId] ?? [];
}

export function getMovieVideoSource(movieId: number): VideoSource | null {
  return getMovieVideoSources(movieId)[0] ?? null;
}

// TV episode sources
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
  return (
    getEpisodeVideoSources(showId, seasonNumber, episodeNumber)[0] ?? null
  );
}
