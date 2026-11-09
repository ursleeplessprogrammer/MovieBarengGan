"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  LoaderCircle,
  Play,
  RefreshCw,
} from "lucide-react";

import type { VideoSource } from "@/lib/video-sources";

type VideoPlayerProps = {
  title: string;
  poster?: string;
  sources: VideoSource[];
};

export function VideoPlayer({
  title,
  poster,
  sources,
}: VideoPlayerProps) {
  const [selectedSourceId, setSelectedSourceId] = useState(
    sources[0]?.id ?? ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setSelectedSourceId(sources[0]?.id ?? "");
    setHasError(false);
    setIsLoading(true);
  }, [sources]);

  const selectedSource =
    sources.find((source) => source.id === selectedSourceId) ??
    sources[0];

  function selectSource(source: VideoSource) {
    setSelectedSourceId(source.id);
    setHasError(false);
    setIsLoading(true);
  }

  if (!selectedSource) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#11151d] text-center">
        <AlertCircle size={36} className="mb-4 text-[#c7f36b]" />
        <h2 className="text-lg font-bold text-white">
          Streaming unavailable
        </h2>
        <p className="mt-2 max-w-sm text-sm text-white/50">
          There are currently no configured video sources for this title.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Server selection */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-white/60">
          Servers:
        </span>

        {sources.map((source) => {
          const isActive = source.id === selectedSource.id;

          return (
            <button
              key={source.id}
              type="button"
              onClick={() => selectSource(source)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-[#c7f36b] bg-[#c7f36b] text-[#10140a]"
                  : "border-white/10 bg-white/[0.04] text-white/65 hover:border-white/30 hover:text-white"
              }`}
            >
              <Play size={13} fill="currentColor" />
              {source.name}
            </button>
          );
        })}
      </div>

      {/* Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#090b10]">
            <LoaderCircle
              size={34}
              className="animate-spin text-[#c7f36b]"
            />
            <p className="mt-3 text-sm text-white/60">
              Loading {selectedSource.name}...
            </p>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#11151d] px-6 text-center">
            <AlertCircle size={34} className="mb-3 text-red-400" />
            <h2 className="text-lg font-bold text-white">
              Unable to load this source
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Try another server or retry this source.
            </p>

            <button
              type="button"
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-5 py-2.5 text-sm font-bold text-[#10140a]"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        ) : selectedSource.kind === "mp4" ? (
          <video
            key={selectedSource.id}
            controls
            playsInline
            preload="metadata"
            poster={poster}
            onLoadedData={() => setIsLoading(false)}
            onCanPlay={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="h-full w-full object-contain"
            aria-label={`Video player: ${title}`}
          >
            <source src={selectedSource.url} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        ) : (
          <iframe
            key={selectedSource.id}
            src={selectedSource.url}
            title={`${title} - ${selectedSource.name}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setIsLoading(false)}
            className="h-full w-full border-0"
          />
        )}
      </div>

      {/* Source attribution */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
        <span>
          Source: {selectedSource.name} · {selectedSource.attribution}
        </span>

        <a
          href={selectedSource.sourcePage}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c7f36b] transition hover:underline"
        >
          Source information
        </a>
      </div>
    </div>
  );
}