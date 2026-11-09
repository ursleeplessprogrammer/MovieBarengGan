
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Plus,
  Sparkles,
  Star,
  Clock3,
  Film,
  Heart,
  Github,
} from "lucide-react";

import { Header } from "@/components/header";
import { MovieCard } from "@/components/movie-card";
import { featuredMovie, movies, publicDomainNote } from "@/lib/movies";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />

      <section className="relative min-h-[720px]">
        <Image
          src={featuredMovie.backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65"
        />

        <div className="hero-overlay absolute inset-0" />

        <div className="page-shell relative z-10 flex min-h-[720px] items-center pb-12 pt-32">
          <div className="max-w-[650px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c7f36b]/30 bg-[#c7f36b]/10 px-3 py-2 text-[10px] font-black tracking-[.17em] text-[#c7f36b]">
              <Sparkles size={13} />
              YOUR NEXT MOVIE NIGHT STARTS HERE
            </div>

            <p className="eyebrow mb-4">
              {featuredMovie.tag}{" "}
              <span className="mx-2 text-white/30">/</span> FEATURED STORY
            </p>

            <h1 className="max-w-[620px] text-6xl font-black leading-[.98] tracking-[-.055em] sm:text-7xl lg:text-[88px]">
              {featuredMovie.title}
              <span className="text-[#c7f36b]">.</span>
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/65">
              <span className="flex items-center gap-1.5 text-[#c7f36b]">
                <Star size={14} fill="currentColor" />
                {featuredMovie.rating}
              </span>
              <span>{featuredMovie.year}</span>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span>{featuredMovie.genre}</span>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span>{featuredMovie.runtime}</span>
            </div>

            <p className="mt-6 max-w-[510px] text-sm leading-7 text-white/65 sm:text-base">
              {featuredMovie.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#movies"
                className="inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-6 py-3.5 text-sm font-black text-[#11150b] transition hover:scale-[1.03]"
              >
                <Play size={16} fill="currentColor" />
                Explore movies
              </a>

              <a
                href="#about"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition hover:bg-white/10"
              >
                <Plus size={17} />
                About MBG
              </a>
            </div>
          </div>

          <div className="absolute bottom-12 right-8 hidden items-center gap-3 text-[10px] font-bold tracking-[.2em] text-white/45 lg:flex">
            <span className="h-px w-12 bg-white/30" />
            01 <span className="text-white/20">/</span> 04
          </div>
        </div>
      </section>

      <section className="page-shell -mt-2 pb-16" id="movies">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">HANDPICKED FOR YOU</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Explore the collection
              <span className="text-[#c7f36b]">.</span>
            </h2>
            <p className="mt-2 text-sm text-white/45">
              Stories worth staying in for.
            </p>
          </div>

          <a
            href="#collections"
            className="mb-1 hidden items-center gap-2 text-xs font-bold text-[#c7f36b] sm:flex"
          >
            View collections <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section id="collections" className="page-shell pb-20">
        <div className="mb-7">
          <p className="eyebrow mb-2">PICK YOUR MOOD</p>
          <h2 className="text-3xl font-black tracking-tight">
            Find your kind of story
            <span className="text-[#c7f36b]">.</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Adventure",
              count: "Go somewhere new",
              icon: ArrowUpRight,
              desc: "Big journeys and bold discoveries",
              tone: "from-emerald-950",
            },
            {
              name: "Drama",
              count: "Feel every moment",
              icon: Heart,
              desc: "Stories that stay with you",
              tone: "from-violet-950",
            },
            {
              name: "Documentary",
              count: "See the real world",
              icon: Film,
              desc: "Curiosity, culture, and nature",
              tone: "from-sky-950",
            },
            {
              name: "Classics",
              count: "Made to last",
              icon: Clock3,
              desc: "Timeless films worth revisiting",
              tone: "from-amber-950",
            },
          ].map((item) => (
            <a
              key={item.name}
              href="#movies"
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} to-[#11151d] p-6 transition hover:-translate-y-1 hover:border-[#c7f36b]/40`}
            >
              <item.icon className="mb-10 text-[#c7f36b]" size={23} />
              <p className="text-xl font-black">{item.name}</p>
              <p className="mt-1 text-xs text-white/45">{item.desc}</p>
              <p className="mt-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/35">
                <span>{item.count}</span>
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:text-[#c7f36b]"
                />
              </p>
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="page-shell pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-[#c7f36b]/20 bg-[#121a14] p-8 sm:p-12">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#c7f36b]/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="eyebrow mb-3">MOVIES ARE BETTER TOGETHER</p>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Good stories.
              <br />
              Great company
              <span className="text-[#c7f36b]">.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">
              MovieBarengGan is a personal movie discovery project built
              around one simple idea: finding something great to watch should
              be part of the fun. Explore a growing collection and make your
              next movie night count.
            </p>

            <a
              href="#movies"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-5 py-3 text-xs font-black text-black"
            >
              Explore the catalog <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="page-shell flex flex-col justify-between gap-4 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} MovieBarengGan · MBG. A personal
            project.
          </p>

          <p className="max-w-2xl leading-5">{publicDomainNote}</p>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-white"
          >
            <Github size={15} />
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
