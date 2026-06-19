export const TRACKING_TYPES = [
  "boolean",
  "boolean_optional_text",
  "number",
  "volume",
  "duration",
  "duration_optional_text",
  "time",
  "scale",
  "scale_optional_text",
  "streak",
  "text_required",
  "multi_text_required",
] as const;

export type TrackingType = (typeof TRACKING_TYPES)[number];

export function isTrackingType(value: string): value is TrackingType {
  return (TRACKING_TYPES as readonly string[]).includes(value);
}

export const DIFFICULTIES = ["easy", "moderate", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const COLOR_GROUPS = [
  "health",
  "mental",
  "productivity",
  "financial",
  "social",
  "home",
] as const;

export type ColorGroup = (typeof COLOR_GROUPS)[number];
