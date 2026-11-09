import { Clapperboard, Search, Menu, UserRound } from "lucide-react";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="page-shell flex h-[82px] items-center justify-between border-b border-white/10">
        <a href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c7f36b] text-[#11150b]"><Clapperboard size={21} /></span>
          <span className="text-lg font-black tracking-tight">MovieBareng<span className="text-[#c7f36b]">Gan</span><span className="ml-1 text-xs font-bold text-white/45">MBG</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/65 md:flex">
          <a className="text-white" href="/">Home</a>
          <a className="transition hover:text-white" href="#movies">Movies</a>
          <a className="transition hover:text-white" href="#collections">Collections</a>
          <a className="transition hover:text-white" href="#about">About</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#movies" aria-label="Search movies" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/75 transition hover:bg-white/10"><Search size={18}/></a>
          <a href="/login" className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-extrabold text-black transition hover:bg-[#c7f36b] sm:flex"><UserRound size={15}/> Sign in</a>
          <button aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 md:hidden"><Menu size={18}/></button>
        </div>
      </div>
    </header>
  );
}