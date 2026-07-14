"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Build } from "@/lib/types";
import { ClaimBadge, SafetyBadge, CategoryBadge } from "@/components/Badges";
import { isSaved, toggleSaved } from "@/lib/saved";
import { youtubeEmbedUrl } from "@/lib/video";

export default function BuildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [build, setBuild] = useState<Build | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch(`/api/builds/${id}`).then(async (r) => {
      if (!r.ok) return setNotFound(true);
      setBuild(await r.json());
    });
    setSaved(isSaved(id));
  }, [id]);

  if (notFound)
    return (
      <div className="empty-state">
        Build not found. <Link href="/">Back to browse</Link>
      </div>
    );
  if (!build) return <div className="empty-state">Loading…</div>;

  const embed = youtubeEmbedUrl(build.sourceUrl);
  const totalCost = build.materials.reduce((sum, m) => sum + m.estPrice, 0);
  const isMyth = build.claimCheck === "over-unity-myth";

  return (
    <>
      <div className="detail-header">
        <div className="badges">
          <ClaimBadge claim={build.claimCheck} />
          <CategoryBadge category={build.category} />
          <SafetyBadge level={build.safetyLevel} />
        </div>
        <h1>{build.title}</h1>
        <p style={{ color: "var(--text-dim)" }}>{build.description}</p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className={saved ? "btn" : "btn btn-secondary"}
            onClick={() => setSaved(toggleSaved(build.id))}
          >
            {saved ? "★ Saved" : "☆ Save build"}
          </button>
          <a
            href={build.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View original ({build.sourcePlatform}) ↗
          </a>
          <span style={{ color: "var(--text-dim)", fontSize: 13.5 }}>
            by {build.creator}
          </span>
        </div>
      </div>

      {isMyth && (
        <div className="myth-box">
          <strong>⚠ Debunked: this build does not work.</strong> It&apos;s
          cataloged so you can recognize the claim when you see it on social
          media. Read the &ldquo;steps&rdquo; below for the physics explanation
          — and check out the legit builds for real DIY energy projects.
        </div>
      )}

      <div className="stat-row">
        <div className="stat">
          <span className="label">Est. cost</span>
          <span className="value">${build.estCost}</span>
        </div>
        <div className="stat">
          <span className="label">Difficulty</span>
          <span className="value">{build.difficulty}</span>
        </div>
        <div className="stat">
          <span className="label">Build time</span>
          <span className="value">{build.buildTime}</span>
        </div>
        <div className="stat">
          <span className="label">Power output</span>
          <span className="value">{build.powerOutput}</span>
        </div>
      </div>

      {embed && (
        <div className="section">
          <h2>Original video</h2>
          <iframe
            className="video-embed"
            src={embed}
            title={build.title}
            allowFullScreen
          />
        </div>
      )}

      {build.safetyWarnings.length > 0 && (
        <div className="section">
          <h2>⚠ Safety first</h2>
          <div className="warning-box">
            <ul>
              {build.safetyWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {build.materials.length > 0 && (
        <div className="section">
          <h2>Materials</h2>
          <table className="materials-table">
            <thead>
              <tr>
                <th></th>
                <th>Item</th>
                <th>Qty</th>
                <th>Est. price</th>
              </tr>
            </thead>
            <tbody>
              {build.materials.map((m, i) => (
                <tr
                  key={i}
                  style={{ opacity: checked[i] ? 0.45 : 1 }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={!!checked[i]}
                      onChange={() =>
                        setChecked((c) => ({ ...c, [i]: !c[i] }))
                      }
                    />
                  </td>
                  <td>{m.name}</td>
                  <td>{m.qty}</td>
                  <td>{m.estPrice === 0 ? "free" : `$${m.estPrice}`}</td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td style={{ fontWeight: 700 }}>Total</td>
                <td></td>
                <td style={{ fontWeight: 700 }}>${totalCost}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {build.tools.length > 0 && (
        <div className="section">
          <h2>Tools</h2>
          <div className="tools-list">
            {build.tools.map((t, i) => (
              <span key={i} className="tool-chip">
                🔧 {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {build.steps.length > 0 && (
        <div className="section">
          <h2>{isMyth ? "Why it doesn't work" : "Build steps"}</h2>
          <ol className="steps-list">
            {build.steps.map((s) => (
              <li key={s.order}>
                <span className="step-num">{s.order}</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
