
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

interface TMDBMovieDetails extends TMDBMovie {
  runtime: number | null;
  genres: {
    id: number;
    name: string;
  }[];
}

interface TMDBResponse<T> {
  results: T[];
}

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
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

function formatRuntime(runtime: number | null): string {
  if (!runtime) return "N/A";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return hours > 0
    ? `${hours}h ${String(minutes).padStart(2, "0")}m`
    : `${minutes}m`;
}

function mapMovie(
  movie: TMDBMovie,
  genres?: TMDBMovieDetails["genres"],
  runtime?: number | null
): Movie {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date
      ? Number(movie.release_date.slice(0, 4))
      : 0,
    rating: movie.vote_average.toFixed(1),
    genre: genres
      ? genres.map((genre) => genre.name).slice(0, 2).join(" · ")
      : movie.genre_ids.slice(0, 2).map(getGenreName).join(" · "),
    runtime: formatRuntime(runtime ?? null),
    poster: movie.poster_path
      ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}`
      : "/placeholder-poster.png",
    backdrop: movie.backdrop_path
      ? `${TMDB_IMAGE_URL}/original${movie.backdrop_path}`
      : "",
    description:
      movie.overview || "No description available for this movie.",
  };
}

function getGenreName(id: number): string {
  const genres: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  return genres[id] ?? "Other";
}

async function getMovieList(endpoint: string): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<TMDBMovie>>(endpoint);

  return data.results.map((movie) => mapMovie(movie));
}

export async function getPopularMovies(): Promise<Movie[]> {
  return getMovieList("/movie/popular?language=en-US&page=1");
}

export async function getTrendingMovies(): Promise<Movie[]> {
  return getMovieList("/trending/movie/week?language=en-US");
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  return getMovieList("/movie/top_rated?language=en-US&page=1");
}

export async function getMovieDetails(id: number): Promise<Movie> {
  const movie = await fetchTMDB<TMDBMovieDetails>(
    `/movie/${id}?language=en-US`
  );

  return mapMovie(movie, movie.genres, movie.runtime);
}
