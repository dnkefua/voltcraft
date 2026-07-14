/** Returns a YouTube embed URL if the link is a YouTube video, else null. */
export function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const shorts = u.pathname.match(/^\/shorts\/([\w-]+)/);
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

export function detectPlatform(
  url: string
): "tiktok" | "youtube" | "reddit" | "instagram" | "other" {
  try {
    const host = new URL(url).hostname;
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("youtube") || host === "youtu.be") return "youtube";
    if (host.includes("reddit")) return "reddit";
    if (host.includes("instagram")) return "instagram";
  } catch {
    /* invalid URL */
  }
  return "other";
}
