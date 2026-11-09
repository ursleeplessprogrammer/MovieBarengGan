
"use client";

import { useState } from "react";
import { AlertCircle, Clapperboard, Play } from "lucide-react";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  title: string;
};

export function VideoPlayer({
  src,
  poster,
  title,
}: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#11151d] text-center">
        <Clapperboard size={36} className="mb-4 text-[#c7f36b]" />
        <h2 className="text-lg font-bold text-white">
          Video unavailable
        </h2>
        <p className="mt-2 max-w-sm text-sm text-white/50">
          There is currently no playable video source for this title.
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#11151d] text-center">
        <AlertCircle size={36} className="mb-4 text-red-400" />
        <h2 className="text-lg font-bold text-white">
          Unable to play this video
        </h2>
        <p className="mt-2 text-sm text-white/50">
          The video source may be unavailable or unsupported.
        </p>
      </div>
    );
  }

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        onError={() => setHasError(true)}
        className="aspect-video w-full object-contain"
        aria-label={`Video player: ${title}`}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
}
