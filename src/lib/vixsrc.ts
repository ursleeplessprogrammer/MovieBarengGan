
export type VixSrcEventName =
  | "play"
  | "pause"
  | "seeked"
  | "ended"
  | "timeupdate";

export type VixSrcPlayerEvent = {
  type: "PLAYER_EVENT";
  data: {
    event: VixSrcEventName;
    currentTime: number;
    duration: number;
    video_id: number;
  };
};

const VIXSRC_ORIGIN = "https://vixsrc.to";

export function buildVixSrcEmbedUrl(
  sourceUrl: string,
  startAt?: number
): string {
  const url = new URL(sourceUrl);

  if (url.origin !== VIXSRC_ORIGIN) {
    return sourceUrl;
  }

  // MovieBarengGan player theme
  url.searchParams.set("primaryColor", "C7F36B");
  url.searchParams.set("secondaryColor", "20251A");
  url.searchParams.set("autoplay", "false");

  // Resume playback when a saved position exists.
  if (typeof startAt === "number" && Number.isFinite(startAt) && startAt > 5) {
    url.searchParams.set("startAt", String(Math.floor(startAt)));
  } else {
    url.searchParams.delete("startAt");
  }

  return url.toString();
}

export function getVixSrcProgressKey(sourceUrl: string): string {
  const url = new URL(sourceUrl);

  return `mbg:vixsrc:progress:${url.pathname}`;
}

export function isVixSrcPlayerEvent(
  value: unknown
): value is VixSrcPlayerEvent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Record<string, unknown>;

  if (message.type !== "PLAYER_EVENT") {
    return false;
  }

  if (!message.data || typeof message.data !== "object") {
    return false;
  }

  const data = message.data as Record<string, unknown>;

  const validEvents: VixSrcEventName[] = [
    "play",
    "pause",
    "seeked",
    "ended",
    "timeupdate",
  ];

  return (
    validEvents.includes(data.event as VixSrcEventName) &&
    typeof data.currentTime === "number" &&
    Number.isFinite(data.currentTime) &&
    typeof data.duration === "number" &&
    Number.isFinite(data.duration) &&
    typeof data.video_id === "number" &&
    Number.isFinite(data.video_id)
  );
}
