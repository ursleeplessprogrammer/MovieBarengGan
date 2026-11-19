# 🎬 MovieBarengGan (MBG)

<img width="100%" height="100%" alt="image" src="https://github.com/user-attachments/assets/7c239407-4322-4a14-818d-e4677469b04a" />

<br>
<p align="center">
  <strong>Movies are better together.</strong>
</p>

<p align="center">
  A movie discovery and streaming platform built to make finding your next favorite movie or TV show easier.
</p>

---

## 📖 About

**MovieBarengGan (MBG)** is a personal web development project focused on bringing movie and TV show discovery into one place.

Inspired by modern streaming platforms, MBG combines a cinematic interface with movie browsing, detailed information, search functionality, and an integrated video player experience.

The project aims to provide a comfortable and intuitive experience for exploring movies and TV shows, discovering new titles, and accessing available streaming sources.

Project link: https://movie-bareng-gan.vercel.app/

## ✨ Features

### 🎥 Movie Discovery
- Explore movie collections and catalogs.
- Browse trending, popular, and top-rated movies.
- View movie posters, backdrops, ratings, genres, and descriptions.
- Access individual movie detail pages.

### 📺 TV Shows
- Browse TV show collections.
- Explore individual TV show details.
- Navigate through available seasons and episodes.
- View episode information, including air dates and runtimes.

### 🔎 Search
- Unified search for movies and TV shows, with content-type filtering.
- Retrieve movie information using TMDB.
- Navigate directly to individual title pages.

### ▶️ Watch Experience
- Dedicated movie and TV episode watch pages.
- Integrated video player interface.
- Support for explicitly configured, authorized MP4 and HTTPS embed sources.
- Per-title playback progress for direct MP4 sources (stored locally in the browser).
- Streaming availability and playback error handling.

### 🎨 User Interface
- Original MovieBarengGan branding.
- Dark cinematic visual design.
- Responsive layouts.
- Featured movie section.
- Curated movie collections.
- Modern navigation and reusable components.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework and application routing |
| [React](https://react.dev/) | User interface |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com/) | Styling and responsive layouts |
| [Lucide React](https://lucide.dev/) | Icons |
| [TMDB API](https://developer.themoviedb.org/) | Movie and TV metadata |
| [Vercel](https://vercel.com/) | Deployment |

## 🗂️ Project Structure

```text
MovieBarengGan/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── movie/
│   │   ├── tv/
│   │   ├── search/
│   │   └── watch/
│   │       ├── movie/
│   │       └── tv/
│   │
│   ├── components/
│   │   ├── header.tsx
│   │   ├── movie-card.tsx
│   │   └── video-player.tsx
│   │
│   └── lib/
│       ├── tmdb.ts
│       ├── video-sources.ts
│       └── movies.ts
│
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ursleeplessprogrammer/MovieBarengGan.git
```

### 2. Navigate to the project directory

```bash
cd MovieBarengGan
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory.

```env
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_api_read_access_token

# Optional JSON array of video sources. Only configure content you own or are authorized to distribute.
MBG_VIDEO_SOURCES_JSON=[]
```

You can obtain your API credentials from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ▶️ Configuring authorized playback

Set `MBG_VIDEO_SOURCES_JSON` in the server environment to a JSON array. A movie entry uses `movieId`; an episode entry uses `showId`, `seasonNumber`, and `episodeNumber`. Each entry requires `id`, `name`, `kind` (`mp4` or `iframe`), `url`, `license`, `attribution`, and `sourcePage`. All URLs must use HTTPS. Example using fictional URLs:

```json
[
  {
    "id": "owned-film-01",
    "movieId": 12345,
    "name": "My Licensed Video CDN",
    "kind": "mp4",
    "url": "https://media.example.com/film.mp4",
    "license": "Owned by the project operator",
    "attribution": "Project media library",
    "sourcePage": "https://media.example.com/terms"
  }
]
```

For MP4 sources, the player stores resume progress locally in the current browser. Cross-origin iframe players cannot expose reliable playback events unless their provider explicitly supplies a documented messaging API, so the app does not claim to track their progress.

## 🔑 API Integration

### The Movie Database (TMDB)

MovieBarengGan uses the TMDB API to retrieve movie and television metadata, including:

- Movie information and descriptions.
- TV show information.
- Movie and TV posters.
- Backdrop images.
- Genres and ratings.
- Search results.
- Season and episode information.

TMDB provides metadata and artwork, not movie files or streaming rights. Video playback is handled separately through the project's video-source integration.

## 🗺️ Development Roadmap

- [x] Original homepage and MBG branding.
- [x] Responsive cinematic interface.
- [x] Movie and TV browsing.
- [x] TMDB metadata integration.
- [x] Movie detail pages.
- [x] TV show detail pages.
- [x] Search functionality.
- [x] Movie watch pages.
- [x] TV episode watch pages.
- [x] Integrated video player interface.
- [x] Remove the unverified third-party fallback and require explicit source configuration.
- [x] Add local resume progress for direct MP4 playback and clarify iframe limitations.
- [x] Improve unified movie and TV search.
- [ ] User authentication and profiles.
- [ ] Personal watchlist and watch history.
- [ ] Supabase database integration.
- [ ] Admin dashboard and content management.

## ⚠️ Disclaimer

MovieBarengGan is an independent personal development project created for educational and development purposes.

Movie metadata and images are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).

MovieBarengGan is not affiliated with, endorsed by, or officially associated with TMDB.

TMDB supplies metadata, not video streams or distribution rights. MovieBarengGan does not scrape or automatically select third-party streaming sites. Playback is disabled unless an administrator explicitly configures a video source for content they own or are authorized to distribute. Use only HTTPS URLs and include the source name, license/authorization description, attribution, and source information page. The app validates the configuration shape and HTTPS URLs, but configuration does not itself establish legal rights.

---

## 📄 License

Please refer to the repository for applicable licensing information.

## 👨‍💻 Author

**ursleeplessprogrammer**
