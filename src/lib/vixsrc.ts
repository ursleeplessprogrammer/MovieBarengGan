export type VixSrcEventName = "play" | "pause" | "seeked" | "ended" | "timeupdate";

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

export function buildVixSrcEmbedUrl(path: string, startAt = 0): string {
  const url = new URL(path, VIXSRC_ORIGIN);
  if (url.origin !== VIXSRC_ORIGIN) {
    throw new Error("Unexpected VixSrc origin");
  }

  url.searchParams.set("primaryColor", "C7F36B");
  url.searchParams.set("secondaryColor", "20251A");
  url.searchParams.set("autoplay", "false");

  if (Number.isFinite(startAt) && startAt > 5) {
    url.searchParams.set("startAt", String(Math.floor(startAt)));
  } else {
    url.searchParams.delete("startAt");
  }
  return url.toString();
}

export function getVixSrcProgressKey(path: string): string {
  return `mbg:vixsrc:progress:${path.replace(/[^a-zA-Z0-9:_-]/g, "_")}`;
}

export function isVixSrcPlayerEvent(value: unknown): value is VixSrcPlayerEvent {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  if (message.type !== "PLAYER_EVENT" || !message.data || typeof message.data !== "object") return false;
  const data = message.data as Record<string, unknown>;
  const events: VixSrcEventName[] = ["play", "pause", "seeked", "ended", "timeupdate"];
  return events.includes(data.event as VixSrcEventName)
    && typeof data.currentTime === "number" && Number.isFinite(data.currentTime)
    && typeof data.duration === "number" && Number.isFinite(data.duration)
    && typeof data.video_id === "number" && Number.isFinite(data.video_id);
}
