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
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number | null;
}

interface TMDBResponse<T> {
  results: T[];
}

interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
}

interface TMDBVideo {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface TMDBMovieDetails extends TMDBMovie {
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  videos: {
    results: TMDBVideo[];
  };
  recommendations: TMDBResponse<TMDBMovie>;
}

export interface MoviePageData {
  movie: Movie;
  director: string;
  cast: TMDBCastMember[];
  trailerUrl: string | null;
  recommendations: Movie[];
}

export class TMDBNotFoundError extends Error {
  constructor() {
    super("Movie not found.");
    this.name = "TMDBNotFoundError";
  }
}

async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB API token is missing. Check your .env.local file.");
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

  if (response.status === 404) {
    throw new TMDBNotFoundError();
  }

  if (!response.ok) {
    throw new Error(`TMDB API request failed: ${response.status}`);
  }

  return response.json();
}

function formatRuntime(runtime: number | null | undefined): string {
  if (!runtime) return "N/A";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m`;
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

function mapMovie(
  movie: TMDBMovie,
  runtime?: number | null,
): Movie {
  const genreNames = movie.genres
    ? movie.genres.map((genre) => genre.name)
    : (movie.genre_ids ?? []).map(getGenreName);

  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date
      ? Number(movie.release_date.slice(0, 4))
      : 0,
    rating: Number(movie.vote_average ?? 0).toFixed(1),
    genre: genreNames.slice(0, 2).join(" · ") || "Uncategorized",
    runtime: formatRuntime(runtime ?? movie.runtime),
    poster: movie.poster_path
      ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}`
      : "/placeholder-poster.svg",
    backdrop: movie.backdrop_path
      ? `${TMDB_IMAGE_URL}/original${movie.backdrop_path}`
      : "",
    description:
      movie.overview || "No description available for this movie.",
  };
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
    `/movie/${id}?language=en-US`,
  );

  return mapMovie(movie, movie.runtime);
}

export async function getMoviePageData(
  id: number,
): Promise<MoviePageData> {
  const details = await fetchTMDB<TMDBMovieDetails>(
    `/movie/${id}?language=en-US&append_to_response=credits,videos,recommendations`,
  );

  const director =
    details.credits?.crew.find((member) => member.job === "Director")
      ?.name ?? "Unknown";

  const cast = (details.credits?.cast ?? []).slice(0, 12);

  const trailer = (details.videos?.results ?? []).find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official,
  ) ?? (details.videos?.results ?? []).find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer",
  );

  const recommendations = (
    details.recommendations?.results ?? []
  )
    .filter((movie) => movie.poster_path)
    .slice(0, 12)
    .map((movie) => mapMovie(movie));

  return {
    movie: mapMovie(details, details.runtime),
    director,
    cast,
    trailerUrl: trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null,
    recommendations,
  };
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<{
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      movies: [],
      totalPages: 0,
      totalResults: 0,
    };
  }

  const params = new URLSearchParams({
    query: trimmedQuery,
    language: "en-US",
    page: String(Math.max(1, page)),
    include_adult: "false",
  });

  const data = await fetchTMDB<
    TMDBResponse<TMDBMovie> & {
      total_pages: number;
      total_results: number;
    }
  >(`/search/movie?${params.toString()}`);

  return {
    movies: data.results.map((movie) => mapMovie(movie)),
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export type TMDBGenre = {
  id: number;
  name: string;
};

export async function getMovieGenres(): Promise<TMDBGenre[]> {
  const data = await fetchTMDB<{
    genres: TMDBGenre[];
  }>("/genre/movie/list?language=en-US");

  return data.genres;
}

export async function discoverMovies(
  genreId?: number,
  year?: number,
  sortBy = "popularity.desc",
  page = 1,
): Promise<{
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}> {
  const params = new URLSearchParams({
    language: "en-US",
    page: String(Math.max(1, page)),
    sort_by: sortBy,
    include_adult: "false",
    include_video: "false",
  });

  if (genreId) {
    params.set("with_genres", String(genreId));
  }

  if (year) {
    params.set("primary_release_year", String(year));
  }

  const data = await fetchTMDB<
    TMDBResponse<TMDBMovie> & {
      total_pages: number;
      total_results: number;
    }
  >(`/discover/movie?${params.toString()}`);

  return {
    movies: data.results.map((movie) => mapMovie(movie)),
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}