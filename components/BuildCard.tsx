import Link from "next/link";
import type { Build } from "@/lib/types";
import { ClaimBadge, SafetyBadge, CategoryBadge } from "./Badges";

export default function BuildCard({ build }: { build: Build }) {
  return (
    <Link href={`/build/${build.id}`} className="card card-link">
      <div className="badges">
        <ClaimBadge claim={build.claimCheck} />
        <CategoryBadge category={build.category} />
        <SafetyBadge level={build.safetyLevel} />
      </div>
      <h3>{build.title}</h3>
      <p>{build.description}</p>
      <div className="card-meta">
        <span>💲{build.estCost}</span>
        <span>📶 {build.difficulty}</span>
        <span>⏱ {build.buildTime}</span>
        <span className="card-open">Open →</span>
      </div>
    </Link>
  );
}
