import { NextRequest, NextResponse } from "next/server";
import { getBuild } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const build = getBuild(id);
  if (!build) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(build);
}
