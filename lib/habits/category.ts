import type { ColorGroup } from "@/types/tracking";

/** Per-color-group palette (hex), mirrors the @theme tokens for inline styling. */
export const COLOR_GROUP_TOKENS: Record<
  ColorGroup,
  { bg: string; text: string; accent: string }
> = {
  health: { bg: "#E1F5EE", text: "#085041", accent: "#1D9E75" },
  mental: { bg: "#EEEDFE", text: "#3C3489", accent: "#534AB7" },
  productivity: { bg: "#E6F1FB", text: "#0C447C", accent: "#185FA5" },
  financial: { bg: "#FAEEDA", text: "#633806", accent: "#BA7517" },
  social: { bg: "#FBEAF0", text: "#72243E", accent: "#993556" },
  home: { bg: "#EAF3DE", text: "#27500A", accent: "#639922" },
};

/** Short filter labels (match the mockup pill labels). */
export const COLOR_GROUP_SHORT: Record<ColorGroup, string> = {
  health: "Health",
  mental: "Mental",
  productivity: "Productivity",
  financial: "Financial",
  social: "Social",
  home: "Home",
};

export const COLOR_GROUP_ORDER: ColorGroup[] = [
  "health",
  "mental",
  "productivity",
  "financial",
  "social",
  "home",
];
