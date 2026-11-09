import Link from "next/link";
export default function NotFound() {
  return <main className="grid min-h-screen place-items-center px-6 text-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#c7f36b]">404 · Not found</p><h1 className="mt-4 text-5xl font-black">This reel is missing.</h1><p className="mt-4 text-white/50">That page is not part of our current collection.</p><Link href="/" className="mt-8 inline-block rounded-full bg-[#c7f36b] px-6 py-3 text-sm font-black text-black">Back to home</Link></div></main>;
}