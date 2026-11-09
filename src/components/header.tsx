
import { Clapperboard, Search, Menu, UserRound } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="page-shell flex h-[82px] items-center justify-between border-b border-white/10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c7f36b] text-[#11150b]">
            <Clapperboard size={21} />
          </span>

          <span className="text-lg font-black tracking-tight">
            MovieBareng<span className="text-[#c7f36b]">Gan</span>
            <span className="ml-1 text-xs font-bold text-white/45">MBG</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/65 md:flex">
          <Link href="/" className="text-white">
            Home
          </Link>

          <Link href="/#movies" className="transition hover:text-white">
            Movies
          </Link>

          <Link href="/#collections" className="transition hover:text-white">
            Collections
          </Link>

          <Link href="/#about" className="transition hover:text-white">
            About
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Link
            href="/search"
            aria-label="Search movies"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/75 transition hover:bg-white/10 hover:text-[#c7f36b]"
          >
            <Search size={18} />
          </Link>

          {/* Sign In */}
          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-extrabold text-black transition hover:bg-[#c7f36b] sm:flex"
          >
            <UserRound size={15} />
            Sign in
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
