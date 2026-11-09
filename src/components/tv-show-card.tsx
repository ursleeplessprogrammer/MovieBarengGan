import Image from "next/image";
import Link from "next/link";
import { Star, Play } from "lucide-react";

import type { TVShow } from "@/lib/tmdb";

export function TVShowCard({ show }: { show: TVShow }) {
  return (
    <article className="poster-card group min-w-0">
      <Link href={`/tv/${show.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/[.08] bg-[#171c25]">
          <Image
            src={show.poster}
            alt={`${show.name} poster`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
            className="poster-image object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/5 opacity-80" />

          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-bold">
            <Star
              size={12}
              fill="#c7f36b"
              className="text-[#c7f36b]"
            />
            {show.rating}
          </span>

          <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-[#c7f36b] text-black opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            <Play size={15} fill="currentColor" />
          </span>
        </div>

        <div className="mt-3">
          <h3 className="truncate text-sm font-bold text-white transition group-hover:text-[#c7f36b]">
            {show.name}
          </h3>

          <p className="mt-1 text-xs text-white/45">
            {show.year || "Release date unknown"}
            <span className="mx-1.5">·</span>
            TV Series
          </p>
        </div>
      </Link>
    </article>
  );
}