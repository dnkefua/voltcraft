import type { ClaimCheck, SafetyLevel } from "@/lib/types";

export function ClaimBadge({ claim }: { claim: ClaimCheck }) {
  if (claim === "legit-diy")
    return <span className="badge badge-legit">✓ Legit DIY</span>;
  if (claim === "over-unity-myth")
    return <span className="badge badge-myth">⚠ Over-unity myth</span>;
  return <span className="badge badge-unverified">? Unverified</span>;
}

export function SafetyBadge({ level }: { level: SafetyLevel }) {
  const labels: Record<SafetyLevel, string> = {
    low: "Safety: Low risk",
    medium: "Safety: Caution",
    high: "Safety: High risk",
  };
  return <span className={`badge badge-safety-${level}`}>{labels[level]}</span>;
}

export function CategoryBadge({ category }: { category: string }) {
  return <span className="badge badge-cat">{category}</span>;
}
