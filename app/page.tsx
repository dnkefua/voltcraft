"use client";

import { useEffect, useMemo, useState } from "react";
import type { Build } from "@/lib/types";
import { CATEGORIES, DIFFICULTIES } from "@/lib/types";
import BuildCard from "@/components/BuildCard";

export default function BrowsePage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [maxCost, setMaxCost] = useState("all");
  const [hideMyths, setHideMyths] = useState(false);

  useEffect(() => {
    fetch("/api/builds")
      .then((r) => r.json())
      .then((data) => setBuilds(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return builds.filter((b) => {
      if (
        search &&
        !`${b.title} ${b.description}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (category !== "all" && b.category !== category) return false;
      if (difficulty !== "all" && b.difficulty !== difficulty) return false;
      if (maxCost !== "all" && b.estCost > Number(maxCost)) return false;
      if (hideMyths && b.claimCheck === "over-unity-myth") return false;
      return true;
    });
  }, [builds, search, category, difficulty, maxCost, hideMyths]);

  return (
    <>
      <h1 className="page-title">DIY Energy Builds</h1>
      <p className="page-sub">
        Community builds turned into step-by-step recipes — with parts lists,
        cost estimates, safety checks, and honest claim verification.
      </p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search builds…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="all">Any difficulty</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select value={maxCost} onChange={(e) => setMaxCost(e.target.value)}>
          <option value="all">Any cost</option>
          <option value="25">Under $25</option>
          <option value="50">Under $50</option>
          <option value="100">Under $100</option>
        </select>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13.5,
            color: "var(--text-dim)",
          }}
        >
          <input
            type="checkbox"
            checked={hideMyths}
            onChange={(e) => setHideMyths(e.target.checked)}
          />
          Hide debunked myths
        </label>
      </div>

      {loading ? (
        <div className="empty-state">Loading builds…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No builds match those filters.</div>
      ) : (
        <div className="grid">
          {filtered.map((b) => (
            <BuildCard key={b.id} build={b} />
          ))}
        </div>
      )}
    </>
  );
}
