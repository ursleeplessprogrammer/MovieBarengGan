"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, ExternalLink, LoaderCircle, RefreshCw } from "lucide-react";
import type { VideoSource } from "@/lib/video-sources";

type VideoPlayerProps = { title: string; poster?: string; sources: VideoSource[]; progressKey?: string };

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds), hours = Math.floor(total / 3600), minutes = Math.floor((total % 3600) / 60), remaining = total % 60;
  return hours > 0 ? [hours, String(minutes).padStart(2, "0"), String(remaining).padStart(2, "0")].join(":")
    : [String(minutes).padStart(2, "0"), String(remaining).padStart(2, "0")].join(":");
}

export function VideoPlayer({ title, poster, sources, progressKey }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedSourceId, setSelectedSourceId] = useState(sources[0]?.id ?? "");
  const [isLoading, setIsLoading] = useState(sources[0]?.kind === "mp4");
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [resumeAt, setResumeAt] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const selectedSource = sources.find((source) => source.id === selectedSourceId) ?? sources[0];

  useEffect(() => {
    setSelectedSourceId(sources[0]?.id ?? "");
    setIsLoading(sources[0]?.kind === "mp4");
    setHasError(false);
    setReloadKey(0);
    setCurrentTime(0);
    setDuration(0);
  }, [sources]);

  useEffect(() => {
    if (!progressKey) { setResumeAt(0); return; }
    try {
      const saved = Number(window.localStorage.getItem(progressKey) ?? 0);
      setResumeAt(Number.isFinite(saved) && saved > 5 ? saved : 0);
    } catch { setResumeAt(0); }
  }, [progressKey, selectedSourceId, reloadKey]);

  function retrySource() {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((value) => value + 1);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    if (progressKey && video.currentTime > 5) {
      try { window.localStorage.setItem(progressKey, String(Math.floor(video.currentTime))); } catch { /* Storage optional. */ }
    }
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video) return;
    let saved = resumeAt;
    if (progressKey) {
      try {
        const stored = Number(window.localStorage.getItem(progressKey) ?? 0);
        if (stored > 5 && Number.isFinite(stored)) saved = stored;
      } catch { /* Storage optional. */ }
    }
    if (saved > 5 && saved < video.duration - 10) video.currentTime = saved;
    setResumeAt(saved);
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setIsLoading(false);
  }

  if (!selectedSource) return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#11151d] px-6 text-center">
      <AlertCircle size={36} className="mb-4 text-[#c7f36b]" />
      <h2 className="text-lg font-bold text-white">No video source available</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-white/50">There is no configured source for this title.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {sources.length > 1 && <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-white/60">Sources:</span>
        {sources.map((source) => <button key={source.id} type="button" onClick={() => {
          setSelectedSourceId(source.id);
          setIsLoading(source.kind === "mp4");
          setHasError(false);
          setCurrentTime(0);
          setDuration(0);
        }} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${source.id === selectedSource.id ? "border-[#c7f36b] bg-[#c7f36b] text-[#10140a]" : "border-white/10 bg-white/[.04] text-white/65 hover:border-white/30 hover:text-white"}`}>
          {source.name}
        </button>)}
      </div>}

      {selectedSource.kind === "mp4" ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
          {isLoading && !hasError && <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#090b10]">
            <LoaderCircle size={34} className="animate-spin text-[#c7f36b]" />
            <p className="mt-3 text-sm text-white/60">Loading {selectedSource.name}…</p>
          </div>}
          {hasError ? <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center bg-[#11151d] px-6 text-center">
            <AlertCircle size={34} className="mb-3 text-red-400" />
            <h2 className="text-lg font-bold text-white">Unable to load this source</h2>
            <p className="mt-2 max-w-sm text-sm text-white/50">The video source may be unavailable. Please try again later.</p>
            <button type="button" onClick={retrySource} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-5 py-2.5 text-sm font-bold text-[#10140a]"><RefreshCw size={14} /> Retry</button>
          </div> : <video key={`${selectedSource.id}-${reloadKey}`} ref={videoRef} controls playsInline preload="metadata" poster={poster} onLoadedMetadata={handleLoadedMetadata} onCanPlay={() => setIsLoading(false)} onTimeUpdate={handleTimeUpdate} onEnded={() => {
            if (progressKey) { try { window.localStorage.removeItem(progressKey); } catch { /* optional */ } }
            setCurrentTime(0);
          }} onError={() => { setIsLoading(false); setHasError(true); }} className="h-full w-full object-contain" aria-label={`Video player: ${title}`}>
            <source src={selectedSource.url} type="video/mp4" />Your browser does not support HTML5 video.
          </video>}
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#090b10] px-6 text-center">
          <ExternalLink size={38} className="mb-4 text-[#c7f36b]" />
          <h2 className="text-xl font-bold text-white">Continue watching on {selectedSource.name}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/55">The video will open in a new tab. If the provider is unavailable, try again later or choose another available source.</p>
          <a href={selectedSource.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-6 py-3 text-sm font-bold text-[#10140a] transition hover:bg-[#d7ff82]">
            Open {selectedSource.name} <ExternalLink size={15} />
          </a>
        </div>
      )}

      {selectedSource.kind === "mp4" && <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
        <span>Playback position: {formatTime(currentTime)}{duration > 0 ? ` / ${formatTime(duration)}` : ""}</span>
        {resumeAt > 5 && currentTime < 5 && <span><RefreshCw size={12} className="mr-1 inline" /> Resume available at {formatTime(resumeAt)}</span>}
      </div>}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="min-w-0"><p className="text-sm font-semibold text-white/80">Source: {selectedSource.name}</p>
          <p className="mt-1 text-xs text-white/40">{selectedSource.license} · {selectedSource.attribution}</p></div>
        <a href={selectedSource.sourcePage} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-[#c7f36b] hover:underline">Source information <ExternalLink size={13} /></a>
      </div>
    </div>
  );
}
