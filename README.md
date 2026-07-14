# ⚡ VoltCraft — DIY Energy Builds

Turn TikTok and YouTube DIY energy videos into structured, step-by-step build recipes — with parts lists, cost estimates, tool lists, safety checks, and honest claim verification.

Think "recipe app," but the recipes are solar chargers, wind turbines, thermoelectric generators, and pedal power stations.

## Features (MVP)

- **Browse & filter** builds by category, difficulty, cost, and search
- **Build detail pages** — materials checklist, ordered steps, tools, safety warnings, embedded source video, creator credit
- **Claim verification badges** — `✓ Legit DIY` / `? Unverified` / `⚠ Over-unity myth` — viral "free energy" scams get cataloged and debunked instead of ignored
- **Safety levels** — every build flagged low / caution / high risk
- **Submit a build** — paste a TikTok/YouTube/Reddit link, complete the recipe form, publishes as *Unverified*
- **Saved builds + combined shopping list** — merges materials across all saved builds into one list with totals (localStorage)

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- Plain CSS (no framework) — dark theme
- MVP data store: `data/builds.json` via API routes

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

> Tip (Windows): clone to a non-OneDrive folder — synced folders make `npm install` extremely slow.

## Roadmap → Firebase / GCP

This repo is designed to deploy on **Firebase App Hosting** (native Next.js support):

1. Firebase console → App Hosting → *Connect repository* → select this repo
2. App Hosting auto-detects Next.js and builds on every push to `main`

Planned backend swaps:

- [ ] `data/builds.json` → **Firestore** (`builds` collection; the JSON file store is ephemeral on serverless hosting — submissions don't persist between instances)
- [ ] localStorage saves → **Firebase Auth** + per-user saved builds
- [ ] `/api/extract` stub → real pipeline: fetch video → transcribe (Whisper) → extract structured build with the **Claude API** → human review queue
- [ ] "I built this" community photos → **Cloud Storage**

## Safety & honesty policy

Builds involving electricity can be dangerous. Every build carries safety warnings and a risk level. Devices claiming *over-unity* / perpetual motion output violate thermodynamics and are flagged as myths with a physics explanation — cataloged so users recognize the scam, never presented as working builds.
