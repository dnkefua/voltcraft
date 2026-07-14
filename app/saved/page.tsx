"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Build } from "@/lib/types";
import BuildCard from "@/components/BuildCard";
import { getSavedIds } from "@/lib/saved";

export default function SavedPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getSavedIds();
    fetch("/api/builds")
      .then((r) => r.json())
      .then((all: Build[]) => setBuilds(all.filter((b) => ids.includes(b.id))))
      .finally(() => setLoading(false));
  }, []);

  const shoppingList = useMemo(() => {
    const byName = new Map<
      string,
      { name: string; entries: { qty: string; build: string }[]; total: number }
    >();
    for (const b of builds) {
      for (const m of b.materials) {
        const key = m.name.toLowerCase();
        const item = byName.get(key) ?? {
          name: m.name,
          entries: [],
          total: 0,
        };
        item.entries.push({ qty: m.qty, build: b.title });
        item.total += m.estPrice;
        byName.set(key, item);
      }
    }
    return [...byName.values()];
  }, [builds]);

  const grandTotal = shoppingList.reduce((s, i) => s + i.total, 0);

  if (loading) return <div className="empty-state">Loading…</div>;

  if (builds.length === 0)
    return (
      <>
        <h1 className="page-title">Saved Builds</h1>
        <div className="empty-state">
          Nothing saved yet. <Link href="/">Browse builds</Link> and hit
          &ldquo;☆ Save build&rdquo; to plan your projects here.
        </div>
      </>
    );

  return (
    <>
      <h1 className="page-title">Saved Builds</h1>
      <div className="grid">
        {builds.map((b) => (
          <BuildCard key={b.id} build={b} />
        ))}
      </div>

      <div className="section">
        <h2>🛒 Combined Shopping List</h2>
        <p className="page-sub" style={{ marginBottom: 12 }}>
          Every material across your saved builds, merged into one trip to the
          store.
        </p>
        <table className="materials-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Needed for</th>
              <th>Est. price</th>
            </tr>
          </thead>
          <tbody>
            {shoppingList.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td style={{ color: "var(--text-dim)", fontSize: 13 }}>
                  {item.entries
                    .map((e) => `${e.qty} (${e.build})`)
                    .join(" · ")}
                </td>
                <td>{item.total === 0 ? "free" : `$${item.total}`}</td>
              </tr>
            ))}
            <tr>
              <td style={{ fontWeight: 800 }}>Total</td>
              <td></td>
              <td className="shopping-total">${grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
