export type ClaimCheck = "legit-diy" | "unverified" | "over-unity-myth";
export type SafetyLevel = "low" | "medium" | "high";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Material {
  name: string;
  qty: string;
  estPrice: number; // USD
}

export interface Step {
  order: number;
  text: string;
}

export interface Build {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  sourcePlatform: "tiktok" | "youtube" | "reddit" | "instagram" | "other";
  creator: string;
  category:
    | "solar"
    | "wind"
    | "thermoelectric"
    | "mechanical"
    | "hydro"
    | "thermal"
    | "other";
  difficulty: Difficulty;
  estCost: number; // USD total
  buildTime: string;
  powerOutput: string;
  materials: Material[];
  tools: string[];
  steps: Step[];
  safetyLevel: SafetyLevel;
  safetyWarnings: string[];
  claimCheck: ClaimCheck;
  status: "published" | "pending";
  createdAt: string;
}

export const CATEGORIES = [
  "solar",
  "wind",
  "thermoelectric",
  "mechanical",
  "hydro",
  "thermal",
  "other",
] as const;

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
