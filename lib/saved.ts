"use client";

const KEY = "voltcraft-saved";

export function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

export function toggleSaved(id: string): boolean {
  const ids = getSavedIds();
  const idx = ids.indexOf(id);
  if (idx >= 0) {
    ids.splice(idx, 1);
  } else {
    ids.push(id);
  }
  localStorage.setItem(KEY, JSON.stringify(ids));
  return idx < 0; // true if now saved
}
