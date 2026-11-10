
"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
    setIsLoading(true);
    setHasError(false);
    setRetryKey(0);
  }, [sources]);

  const selectedSource = sources[selectedIndex];

  function selectSource(index: number) {
    setSelectedIndex(index);
    setIsLoading(true);
    setHasError(false);
    setRetryKey(0);
  }

  function retrySource() {
    setIsLoading(true);
    setHasError(false);
    setRetryKey((current) => current + 1);
  }

  function handleSourceError() {
    setIsLoading(false);

    // Automatically try the next source when available.
    if (selectedIndex < sources.length - 1) {
      setSelectedIndex((current) => current + 1);
      setIsLoading(true);
      setHasError(false);
      setRetryKey(0);
      return;
    }

    setHasError(true);
  }

  if (!selectedSource) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/50 p-6 text-center">
        <AlertCircle className="mb-3 h-10 w-10 text-white/40" />

        <h3 className="text-lg font-semibold text-white">
          Streaming unavailable
        </h3>

        <p className="mt-2 max-w-md text-sm text-white/50">
          No authorized video source is currently available
          for this title.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sources.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-white/60">
            Servers:
          </span>

          {sources.map((source, index) => (
            <button
              key={source.id}
              type="button"
              onClick={() => selectSource(index)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                selectedIndex === index
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
            <LoaderCircle className="mb-3 h-9 w-9 animate-spin text-red-500" />

            <p className="text-sm text-white/60">
              Loading {selectedSource.name}...
            </p>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="mb-3 h-10 w-10 text-red-500" />

            <h3 className="text-lg font-semibold text-white">
              Unable to play this video
            </h3>

            <p className="mt-2 max-w-md text-sm text-white/50">
              This source may be unavailable, may not allow
              embedding, or may not support playback.
            </p>

            <button
              type="button"
              onClick={retrySource}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : selectedSource.kind === "mp4" ? (
          <video
            key={`${selectedSource.id}-${retryKey}`}
            controls
            playsInline
            preload="metadata"
            poster={poster}
            onLoadedData={() => setIsLoading(false)}
            onCanPlay={() => setIsLoading(false)}
            onError={handleSourceError}
            className="h-full w-full object-contain"
            aria-label={`Video player: ${title}`}
          >
            <source
              src={selectedSource.url}
              type="video/mp4"
            />
            Your browser does not support HTML5 video.
          </video>
        ) : (
          <iframe
            key={`${selectedSource.id}-${retryKey}`}
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

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/40">
        <div className="space-y-1">
          <p>
            Playing with:{" "}
            <span className="font-medium text-white/70">
              {selectedSource.name}
            </span>
          </p>

          <p>{selectedSource.attribution}</p>
        </div>

        <a
          href={selectedSource.sourcePage}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition hover:text-white"
        >
          Open source
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
