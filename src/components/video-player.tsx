
"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  LoaderCircle,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  Play,
  RefreshCw,
  X,
} from "lucide-react";

import type { VideoSource } from "@/lib/video-sources";

import {
  buildVixSrcEmbedUrl,
  getVixSrcProgressKey,
  isVixSrcPlayerEvent,
} from "@/lib/vixsrc";

type VideoPlayerProps = {
  title: string;
  poster?: string;
  sources: VideoSource[];
};

type SavedProgress = {
  key: string;
  seconds: number;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    String(minutes).padStart(2, "0"),
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

export function VideoPlayer({
  title,
  poster,
  sources,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [selectedSourceId, setSelectedSourceId] = useState(
    sources[0]?.id ?? ""
  );

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [resumeProgress, setResumeProgress] =
    useState<SavedProgress | null>(null);

  const [playbackStatus, setPlaybackStatus] = useState("ready");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Floating player state.
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    setSelectedSourceId(sources[0]?.id ?? "");
    setIsLoading(true);
    setHasError(false);
    setReloadKey(0);
    setResumeProgress(null);
    setPlaybackStatus("ready");
    setCurrentTime(0);
    setDuration(0);
    setIsFloating(false);
  }, [sources]);

  const selectedSource =
    sources.find((source) => source.id === selectedSourceId) ??
    sources[0];

  const isVixSrc = selectedSource?.id === "vixsrc";

  const progressKey =
    isVixSrc && selectedSource
      ? getVixSrcProgressKey(selectedSource.url)
      : "";

  // Restore previously saved playback position.
  useEffect(() => {
    if (!progressKey) {
      setResumeProgress(null);
      return;
    }

    const saved = window.localStorage.getItem(progressKey);
    const seconds = saved === null ? 0 : Number(saved);

    setResumeProgress({
      key: progressKey,
      seconds:
        Number.isFinite(seconds) && seconds > 5
          ? seconds
          : 0,
    });
  }, [progressKey, reloadKey]);

  const startAt =
    resumeProgress?.key === progressKey
      ? resumeProgress.seconds
      : 0;

  // Build the customized VixSrc iframe URL.
  const iframeSrc =
    selectedSource?.kind === "iframe" && isVixSrc
      ? buildVixSrcEmbedUrl(selectedSource.url, startAt)
      : selectedSource?.url ?? "";

  // Direct provider URL for opening in a new tab.
  const newTabUrl = selectedSource
    ? selectedSource.kind === "iframe"
      ? iframeSrc
      : selectedSource.url
    : "";

  function openInNewTab() {
    if (!newTabUrl) return;

    window.open(newTabUrl, "_blank", "noopener,noreferrer");
  }

  // Listen for VixSrc player messages.
  useEffect(() => {
    if (!isVixSrc || !selectedSource) {
      return;
    }

    const expectedOrigin = new URL(selectedSource.url).origin;

    function handlePlayerMessage(event: MessageEvent<unknown>) {
      if (event.origin !== expectedOrigin) {
        return;
      }

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      if (!isVixSrcPlayerEvent(event.data)) {
        return;
      }

      const playerEvent = event.data.data;

      setCurrentTime(playerEvent.currentTime);
      setDuration(playerEvent.duration);
      setPlaybackStatus(playerEvent.event);

      if (playerEvent.event === "ended") {
        window.localStorage.removeItem(progressKey);
        setResumeProgress(null);
        return;
      }

      if (playerEvent.currentTime >= 0) {
        window.localStorage.setItem(
          progressKey,
          String(Math.floor(playerEvent.currentTime))
        );
      }
    }

    window.addEventListener("message", handlePlayerMessage);

    return () => {
      window.removeEventListener("message", handlePlayerMessage);
    };
  }, [isVixSrc, selectedSource, progressKey, reloadKey]);

  function selectSource(source: VideoSource) {
    setSelectedSourceId(source.id);
    setIsLoading(true);
    setHasError(false);
    setReloadKey((previous) => previous + 1);
    setPlaybackStatus("ready");
    setCurrentTime(0);
    setDuration(0);
  }

  function retrySource() {
    setIsLoading(true);
    setHasError(false);
    setReloadKey((previous) => previous + 1);
    setPlaybackStatus("ready");
  }

  function handleMediaError() {
    setIsLoading(false);
    setHasError(true);
  }

  if (!selectedSource) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#11151d] text-center">
        <AlertCircle size={36} className="mb-4 text-[#c7f36b]" />

        <h2 className="text-lg font-bold text-white">
          Streaming unavailable
        </h2>

        <p className="mt-2 max-w-sm text-sm text-white/50">
          No video sources are currently available for this title.
        </p>
      </div>
    );
  }

  const playerContent = (
    <>
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

          <p className="mt-2 max-w-sm text-sm text-white/50">
            The video source could not be played.
            Try again or open it in a new tab.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={retrySource}
              className="inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-5 py-2.5 text-sm font-bold text-[#10140a]"
            >
              <RefreshCw size={14} />
              Retry
            </button>

            <button
              type="button"
              onClick={openInNewTab}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <ExternalLink size={14} />
              Open in new tab
            </button>
          </div>
        </div>
      ) : selectedSource.kind === "mp4" ? (
        <video
          key={`${selectedSource.id}-${reloadKey}`}
          controls
          playsInline
          preload="metadata"
          poster={poster}
          onLoadedData={() => setIsLoading(false)}
          onCanPlay={() => setIsLoading(false)}
          onError={handleMediaError}
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
          key={`${selectedSource.id}-${reloadKey}`}
          ref={iframeRef}
          src={iframeSrc}
          title={`${title} - ${selectedSource.name}`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="eager"
          onLoad={() => setIsLoading(false)}
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </>
  );

  return (
    <div className="space-y-4">
      {/* Source selection */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-white/60">
          Sources:
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

      {/* Player toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
          {isFloating ? "Floating player mode" : "Video player"}
        </span>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsFloating((previous) => !previous)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-[#c7f36b] hover:text-[#c7f36b]"
          >
            {isFloating ? (
              <>
                <Minimize2 size={14} />
                Restore player
              </>
            ) : (
              <>
                <PictureInPicture2 size={14} />
                Float player
              </>
            )}
          </button>

          <button
            type="button"
            onClick={openInNewTab}
            className="inline-flex items-center gap-2 rounded-full bg-[#c7f36b] px-4 py-2 text-xs font-bold text-[#10140a] transition hover:bg-[#d7ff83]"
          >
            <ExternalLink size={14} />
            Open in new tab
          </button>
        </div>
      </div>

      {/* Main player or floating player */}
      {isFloating ? (
        <div
          className="fixed bottom-5 right-5 z-[90] flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#11151d] shadow-2xl shadow-black/60"
          style={{
            width: "min(92vw, 680px)",
            height: "min(58vw, 430px)",
            minWidth: "300px",
            minHeight: "190px",
            maxWidth: "92vw",
            maxHeight: "80vh",
            resize: "both",
            overflow: "hidden",
          }}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#171c25] px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {title}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-white/40">
                {selectedSource.name}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFloating(false)}
                title="Restore player"
                className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-[#c7f36b]"
              >
                <Maximize2 size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsFloating(false)}
                title="Close floating mode"
                className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 bg-black">
            {playerContent}
          </div>
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
          {playerContent}
        </div>
      )}

      {/* Playback information */}
      {isVixSrc && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
          <span>
            Status:{" "}
            <span className="font-semibold capitalize text-[#c7f36b]">
              {playbackStatus}
            </span>
          </span>

          <span>
            {formatTime(currentTime)}
            {duration > 0 && ` / ${formatTime(duration)}`}
          </span>
        </div>
      )}

      {/* Resume information */}
      {isVixSrc && startAt > 5 && (
        <p className="text-xs text-white/40">
          <RefreshCw size={12} className="mr-1 inline" />
          Resuming from {formatTime(startAt)}
        </p>
      )}

      {/* Cross-origin iframe fallback information */}
      {isVixSrc && !hasError && (
        <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/80">
              Having trouble playing?
            </p>
            <p className="mt-1 text-xs text-white/45">
              If the embedded player is blocked, open it in a new tab instead.
            </p>
          </div>

          <button
            type="button"
            onClick={openInNewTab}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#c7f36b]/40 px-4 py-2 text-xs font-semibold text-[#c7f36b] transition hover:bg-[#c7f36b]/10"
          >
            <ExternalLink size={13} />
            Open in new tab
          </button>
        </div>
      )}

      {/* Source information */}
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
