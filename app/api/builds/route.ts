import { NextRequest, NextResponse } from "next/server";
import { readBuilds, addBuild } from "@/lib/db";
import { detectPlatform } from "@/lib/video";
import type { Build } from "@/lib/types";

export async function GET() {
  return NextResponse.json(readBuilds());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.title || !body.sourceUrl) {
    return NextResponse.json(
      { error: "title and sourceUrl are required" },
      { status: 400 }
    );
  }

  const build: Build = {
    id: crypto.randomUUID(),
    title: String(body.title),
    description: String(body.description ?? ""),
    sourceUrl: String(body.sourceUrl),
    sourcePlatform: detectPlatform(String(body.sourceUrl)),
    creator: String(body.creator ?? "unknown"),
    category: body.category ?? "other",
    difficulty: body.difficulty ?? "beginner",
    estCost: Number(body.estCost) || 0,
    buildTime: String(body.buildTime ?? "unknown"),
    powerOutput: String(body.powerOutput ?? "unknown"),
    materials: Array.isArray(body.materials) ? body.materials : [],
    tools: Array.isArray(body.tools) ? body.tools : [],
    steps: Array.isArray(body.steps) ? body.steps : [],
    safetyLevel: body.safetyLevel ?? "medium",
    safetyWarnings: Array.isArray(body.safetyWarnings)
      ? body.safetyWarnings
      : [],
    // Community submissions always start unverified until reviewed.
    claimCheck: "unverified",
    status: "published",
    createdAt: new Date().toISOString(),
  };

  addBuild(build);
  return NextResponse.json(build, { status: 201 });
}
