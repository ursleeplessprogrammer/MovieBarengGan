
import type { Movie } from "@/lib/movies";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  27: "Horror",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
};

async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB API token is missing.");
  }

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

function mapMovie(movie: TMDBMovie): Movie {
  return {
    id: String(movie.id),
    title: movie.title,
    year: movie.release_date
      ? Number(movie.release_date.slice(0, 4))
      : 0,
    genre:
      movie.genre_ids
        .map((id) => genreMap[id])
        .filter(Boolean)
        .slice(0, 2)
        .join(" · ") || "Movie",
    rating: movie.vote_average.toFixed(1),
    poster: movie.poster_path
      ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}`
      : "/placeholder-poster.png",
    backdrop: movie.backdrop_path
      ? `${TMDB_IMAGE_URL}/original${movie.backdrop_path}`
      : "",
    tag: undefined,
  };
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: TMDBMovie[] }>(
    "/movie/popular?language=en-US&page=1"
  );

  return data.results.map(mapMovie);
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: TMDBMovie[] }>(
    "/trending/movie/week?language=en-US"
  );

  return data.results.map(mapMovie);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: TMDBMovie[] }>(
    "/movie/top_rated?language=en-US&page=1"
  );

  return data.results.map(mapMovie);
}
