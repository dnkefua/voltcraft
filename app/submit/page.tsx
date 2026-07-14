"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, DIFFICULTIES } from "@/lib/types";

interface Draft {
  title: string;
  description: string;
  sourceUrl: string;
  creator: string;
  category: string;
  difficulty: string;
  estCost: number;
  buildTime: string;
  powerOutput: string;
  safetyLevel: string;
}

export default function SubmitPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [materialsText, setMaterialsText] = useState("");
  const [toolsText, setToolsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [warningsText, setWarningsText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function extract() {
    setExtracting(true);
    setError("");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "extraction failed");
      setDraft(data.draft);
      setNote(data.note);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setExtracting(false);
    }
  }

  async function submit() {
    if (!draft) return;
    setSubmitting(true);
    setError("");
    try {
      const materials = materialsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
          // Format: "name | qty | price"
          const [name, qty = "1", price = "0"] = line.split("|").map((s) => s.trim());
          return { name, qty, estPrice: Number(price) || 0 };
        });
      const tools = toolsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const steps = stepsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((text, i) => ({ order: i + 1, text }));
      const safetyWarnings = warningsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const res = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          materials,
          tools,
          steps,
          safetyWarnings,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "submission failed");
      router.push(`/build/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Submit a Build</h1>
      <p className="page-sub">
        Paste a TikTok, YouTube, or Reddit link to a DIY energy project. We
        pre-fill what we can — you complete the recipe. All submissions start
        as <strong>Unverified</strong> until reviewed.
      </p>

      <div className="filters" style={{ marginTop: 22 }}>
        <input
          type="text"
          placeholder="https://www.tiktok.com/@creator/video/… or YouTube link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn" onClick={extract} disabled={extracting || !url}>
          {extracting ? "Analyzing…" : "Analyze link"}
        </button>
      </div>

      {note && <div className="note-box">🤖 {note}</div>}
      {error && (
        <div className="note-box" style={{ borderColor: "var(--red)", color: "var(--red)" }}>
          {error}
        </div>
      )}

      {draft && (
        <div className="form-grid">
          <div className="form-field full">
            <label>Build title *</label>
            <input
              className="field"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. PVC Wind Turbine for 12V Charging"
            />
          </div>
          <div className="form-field full">
            <label>Description</label>
            <textarea
              className="field"
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </div>
          <div className="form-field">
            <label>Creator credit</label>
            <input
              className="field"
              value={draft.creator}
              onChange={(e) => setDraft({ ...draft, creator: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Category</label>
            <select
              className="field"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Difficulty</label>
            <select
              className="field"
              value={draft.difficulty}
              onChange={(e) =>
                setDraft({ ...draft, difficulty: e.target.value })
              }
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Estimated cost (USD)</label>
            <input
              className="field"
              type="number"
              value={draft.estCost}
              onChange={(e) =>
                setDraft({ ...draft, estCost: Number(e.target.value) })
              }
            />
          </div>
          <div className="form-field">
            <label>Build time</label>
            <input
              className="field"
              value={draft.buildTime}
              onChange={(e) =>
                setDraft({ ...draft, buildTime: e.target.value })
              }
              placeholder="e.g. 2 hours"
            />
          </div>
          <div className="form-field">
            <label>Power output</label>
            <input
              className="field"
              value={draft.powerOutput}
              onChange={(e) =>
                setDraft({ ...draft, powerOutput: e.target.value })
              }
              placeholder="e.g. 5V / 1A in full sun"
            />
          </div>
          <div className="form-field">
            <label>Safety level</label>
            <select
              className="field"
              value={draft.safetyLevel}
              onChange={(e) =>
                setDraft({ ...draft, safetyLevel: e.target.value })
              }
            >
              <option value="low">Low — no mains, no big batteries</option>
              <option value="medium">Medium — heat, blades, or batteries</option>
              <option value="high">High — AC power or high current</option>
            </select>
          </div>
          <div className="form-field full">
            <label>Materials — one per line: name | qty | price</label>
            <textarea
              className="field"
              rows={4}
              value={materialsText}
              onChange={(e) => setMaterialsText(e.target.value)}
              placeholder={"5V solar panel | 1 | 10\n22 AWG wire | 1 m | 1"}
            />
          </div>
          <div className="form-field full">
            <label>Tools — one per line</label>
            <textarea
              className="field"
              rows={3}
              value={toolsText}
              onChange={(e) => setToolsText(e.target.value)}
              placeholder={"Soldering iron\nMultimeter"}
            />
          </div>
          <div className="form-field full">
            <label>Steps — one per line, in order</label>
            <textarea
              className="field"
              rows={6}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              placeholder={"Test the panel voltage in sunlight\nSolder panel to converter input"}
            />
          </div>
          <div className="form-field full">
            <label>Safety warnings — one per line</label>
            <textarea
              className="field"
              rows={3}
              value={warningsText}
              onChange={(e) => setWarningsText(e.target.value)}
              placeholder={"Verify output voltage before connecting a device"}
            />
          </div>
          <div className="full">
            <button
              className="btn"
              onClick={submit}
              disabled={submitting || !draft.title}
            >
              {submitting ? "Publishing…" : "Publish build (as Unverified)"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
