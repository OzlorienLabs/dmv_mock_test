/**
 * Core domain types for the CA DMV mock-test app.
 *
 * Questions carry provenance (`origin` + optional `sourceUrl`) so the UI can
 * show where each item came from: a real official/sourced question with a link,
 * or an AI-generated practice question grounded in a handbook reference.
 */

export type CategoryId =
  | "right-of-way"
  | "signs-signals"
  | "speed-limits"
  | "parking"
  | "lanes-passing"
  | "dui-alcohol"
  | "restraints"
  | "sharing-road"
  | "freeway"
  | "railroad"
  | "emergencies"
  | "distracted"
  | "vehicle-equipment"
  | "insurance"
  | "weather"
  | "licensing-misc";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  /** Relative weight used for exam-like category sampling (≈ target Q count). */
  weight: number;
}

/** Topic distribution mirrors the real exam emphasis (see implementation plan). */
export const CATEGORIES: CategoryMeta[] = [
  { id: "right-of-way", label: "Right-of-Way & Intersections", weight: 130 },
  { id: "signs-signals", label: "Signs, Signals & Markings", weight: 120 },
  { id: "speed-limits", label: "Speed Limits & Zones", weight: 90 },
  { id: "parking", label: "Parking", weight: 80 },
  { id: "lanes-passing", label: "Lane Use & Passing", weight: 90 },
  { id: "dui-alcohol", label: "Alcohol, Drugs & DUI", weight: 90 },
  { id: "restraints", label: "Seat Belts & Child Restraints", weight: 70 },
  { id: "sharing-road", label: "Sharing the Road", weight: 80 },
  { id: "freeway", label: "Freeway & Merging", weight: 70 },
  { id: "railroad", label: "Railroad & Grade Crossings", weight: 60 },
  { id: "emergencies", label: "Emergencies & Move-Over Law", weight: 70 },
  { id: "distracted", label: "Distracted Driving & Phones", weight: 70 },
  { id: "vehicle-equipment", label: "Vehicle Equipment & Maintenance", weight: 60 },
  { id: "insurance", label: "Insurance & Financial Responsibility", weight: 50 },
  { id: "weather", label: "Weather & Special Conditions", weight: 60 },
  { id: "licensing-misc", label: "Licensing & Misc", weight: 60 },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryMeta>;

export type Origin = "official_dmv" | "sourced" | "generated";

export type LanguageCode = "en" | "bn" | "hi" | "es";

export interface Question {
  id: string;
  category: CategoryId;
  subtopic?: string;
  difficulty?: 1 | 2 | 3;
  prompt: string;
  /** 2–4 answer options; the real CA test typically uses 3. */
  options: string[];
  /** Index into `options` of the correct answer. */
  correctIndex: number;
  /** Short explanation of the correct answer (English seed; other langs added later). */
  explanation?: string;
  /** Optional diagram key rendered alongside the question. */
  diagramId?: string;
  origin: Origin;
  sourceUrl?: string;
  sourceName?: string;
  /** Reference to the handbook section / vehicle code the fact is grounded in. */
  handbookRef?: string;
}

/** A single recorded answer during a test. */
export interface AnswerItem {
  questionId: string;
  selectedIndex: number | null;
}
