import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "@/lib/video";

/**
 * Extraction stub — in production this would:
 *  1. Fetch video metadata / download audio
 *  2. Transcribe with Whisper
 *  3. Extract a structured build with the Claude API
 * For the MVP it pre-fills what it can from the URL and lets the user
 * complete the rest in the editable form.
 */
export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const platform = detectPlatform(url);

  // Try to guess the creator handle from the URL path (works for TikTok/IG).
  let creator = "unknown";
  try {
    const match = new URL(url).pathname.match(/@([\w.-]+)/);
    if (match) creator = `@${match[1]}`;
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  return NextResponse.json({
    draft: {
      title: "",
      description: "",
      sourceUrl: url,
      sourcePlatform: platform,
      creator,
      category: "other",
      difficulty: "beginner",
      estCost: 0,
      buildTime: "",
      powerOutput: "",
      materials: [],
      tools: [],
      steps: [],
      safetyLevel: "medium",
      safetyWarnings: [],
    },
    note:
      platform === "other"
        ? "Couldn't recognize the platform — you can still fill in the build manually."
        : `Detected a ${platform} link. AI auto-extraction is stubbed in this MVP — fill in the details below (production version transcribes the video and extracts everything automatically).`,
  });
}
