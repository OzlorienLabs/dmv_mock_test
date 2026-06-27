/**
 * Test profiles encode the real CA DMV pass rules.
 *
 * NOTE: thresholds reflect commonly published values and are intentionally kept
 * as plain config so they can be re-verified against the live DMV handbook
 * before launch (see plan "Open risks").
 *   - Original / first-time Class C: 46 questions, pass with 38 correct (~83%).
 *   - Renewal: 36 questions, pass with 30 correct (~83%).
 */
export type TestProfileId = "original" | "renewal";

export interface TestProfile {
  id: TestProfileId;
  label: string;
  questionCount: number;
  passCount: number;
  description: string;
}

export const TEST_PROFILES: Record<TestProfileId, TestProfile> = {
  original: {
    id: "original",
    label: "Original (first-time license)",
    questionCount: 46,
    passCount: 38,
    description: "46 questions • pass with 38 correct (≈83%)",
  },
  renewal: {
    id: "renewal",
    label: "Renewal",
    questionCount: 36,
    passCount: 30,
    description: "36 questions • pass with 30 correct (≈83%)",
  },
};

export function getProfile(id: TestProfileId): TestProfile {
  return TEST_PROFILES[id];
}
