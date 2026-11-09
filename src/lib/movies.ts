export type Movie = {
  id: number;
  title: string;
  year: number;
  rating: string;
  genre: string;
  runtime: string;
  poster: string;
  backdrop: string;
  description: string;
  tag?: string;
};

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

export const featuredMovie: Movie = {
  id: 1,
  title: "The Last Light",
  year: 2024,
  rating: "8.7",
  genre: "Adventure · Mystery",
  runtime: "2h 08m",
  poster: image("photo-1478720568477-152d9b164e26"),
  backdrop: image("photo-1519608487953-e999c86e7455"),
  description: "At the edge of a quiet coastal town, an old signal begins to shine again. One unexpected discovery sends a small group on a journey through forgotten stories, impossible choices, and the meaning of home.",
  tag: "EDITOR'S PICK"
};

export const movies: Movie[] = [
  { id: 2, title: "Midnight in Paris", year: 2011, rating: "7.7", genre: "Fantasy · Romance", runtime: "1h 34m", poster: image("photo-1500530855697-b586d89ba3ee"), backdrop: "", description: "A nostalgic journey through art, time, and the streets of Paris.", tag: "TIMELESS" },
  { id: 3, title: "Into the Wild", year: 2007, rating: "8.1", genre: "Adventure · Drama", runtime: "2h 28m", poster: image("photo-1464822759023-fed622ff2c3b"), backdrop: "", description: "A young traveler leaves the familiar behind in search of a life less ordinary." },
  { id: 4, title: "The Grand Journey", year: 2022, rating: "8.3", genre: "Drama · Adventure", runtime: "1h 52m", poster: image("photo-1470252649378-9c29740c9fa8"), backdrop: "", description: "A sweeping story about friendship, distance, and finding your way back." },
  { id: 5, title: "Blue Horizon", year: 2023, rating: "7.9", genre: "Documentary", runtime: "1h 41m", poster: image("photo-1500375592092-40eb2168fd21"), backdrop: "", description: "A breathtaking look at the fragile beauty of our oceans." },
  { id: 6, title: "City of Dreams", year: 2021, rating: "8.0", genre: "Drama · Crime", runtime: "1h 58m", poster: image("photo-1519608487953-e999c86e7455"), backdrop: "", description: "In a city that never sleeps, every street has a story to tell." },
  { id: 7, title: "Wildflower", year: 2020, rating: "7.6", genre: "Romance · Drama", runtime: "1h 46m", poster: image("photo-1490750967868-88aa4486c946"), backdrop: "", description: "Two strangers find an unexpected connection in a small mountain town." },
  { id: 8, title: "The Deep Blue", year: 2019, rating: "8.4", genre: "Documentary · Nature", runtime: "1h 32m", poster: image("photo-1518837695005-2083093ee35b"), backdrop: "", description: "Explore the hidden worlds beneath the surface of the sea." },
  { id: 9, title: "After the Rain", year: 2023, rating: "7.8", genre: "Drama", runtime: "1h 49m", poster: image("photo-1519681393784-d120267933ba"), backdrop: "", description: "A heartfelt portrait of resilience and new beginnings." }
];

export const publicDomainNote = "The initial catalog uses visual placeholders. Before enabling playback, replace entries with verified public-domain titles and video files from sources whose distribution terms permit your intended use.";
