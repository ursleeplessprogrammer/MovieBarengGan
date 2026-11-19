import { Clapperboard, Search } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="page-shell border-b border-white/10">
        <div className="flex h-[76px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c7f36b] text-[#11150b]">
              <Clapperboard size={21} />
            </span>
            <span className="text-base font-black tracking-tight sm:text-lg">
              MovieBareng<span className="text-[#c7f36b]">Gan</span>
              <span className="ml-1 text-xs font-bold text-white/45">MBG</span>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-5 text-sm font-semibold text-white/65 md:flex">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <Link href="/discover" className="transition hover:text-white">Movies</Link>
            <Link href="/tv" className="transition hover:text-white">TV Shows</Link>
            <Link href="/search" className="transition hover:text-white">Search</Link>
          </nav>
          <Link href="/search" aria-label="Search movies and TV shows" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/75 transition hover:bg-white/10 hover:text-[#c7f36b]">
            <Search size={18} />
          </Link>
        </div>
        <nav aria-label="Mobile navigation" className="flex items-center justify-center gap-8 border-t border-white/[.06] py-3 text-xs font-semibold text-white/65 md:hidden">
          <Link href="/" className="transition hover:text-white">Home</Link>
          <Link href="/discover" className="transition hover:text-white">Movies</Link>
          <Link href="/tv" className="transition hover:text-white">TV Shows</Link>
          <Link href="/search" className="transition hover:text-white">Search</Link>
        </nav>
      </div>
    </header>
  );
}
