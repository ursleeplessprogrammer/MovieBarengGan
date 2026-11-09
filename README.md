# 🎬 MovieBarengGan (MBG)

<img width="511" height="482" alt="image" src="https://github.com/user-attachments/assets/7c239407-4322-4a14-818d-e4677469b04a" />

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
- Search for movies and TV shows.
- Retrieve movie information using TMDB.
- Navigate directly to individual title pages.

### ▶️ Watch Experience
- Dedicated movie and TV episode watch pages.
- Integrated video player interface.
- Support for multiple video sources.
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
```

You can obtain your API credentials from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- [ ] Improve streaming source availability and reliability.
- [ ] User authentication and profiles.
- [ ] Personal watchlist and watch history.
- [ ] Supabase database integration.
- [ ] Admin dashboard and content management.

## ⚠️ Disclaimer

MovieBarengGan is an independent personal development project created for educational and development purposes.

Movie metadata and images are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).

MovieBarengGan is not affiliated with, endorsed by, or officially associated with TMDB.

Streaming functionality depends on separately configured video sources. Only content that is legally authorized for distribution should be used.

## 👨‍💻 Developer

**Ivan Vincent Kwenandar**

- GitHub: [@ursleeplessprogrammer](https://github.com/ursleeplessprogrammer)
- Project: [MovieBarengGan](https://github.com/ursleeplessprogrammer/MovieBarengGan)

---

<p align="center">
  <strong>MovieBarengGan · MBG</strong>
  <br />
  Movies are better together. 🍿
</p>
