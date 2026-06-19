import type { ColorGroup } from "@/types/tracking";

/**
 * Derive the 6-group visual color category from the CSV taxonomy.
 * The design splits "Health & Body" into Body (health) and Mind (mental);
 * the CSV's category_group_cn already encodes this as 身 (body) vs 心 (mind).
 * See docs/plan/part1/DATA_MODEL.md §2.
 */
export function deriveColorGroup(
  categoryGroupEn: string,
  categoryGroupCn?: string | null,
): ColorGroup {
  if (categoryGroupCn === "心") return "mental";
  if (categoryGroupEn === "Health & Body") return "health";
  if (categoryGroupEn.startsWith("Productivity")) return "productivity";
  if (categoryGroupEn === "Financial") return "financial";
  if (categoryGroupEn.startsWith("Social")) return "social";
  if (categoryGroupEn.startsWith("Home")) return "home";
  throw new Error(
    `Cannot derive color group from "${categoryGroupEn}" / "${categoryGroupCn ?? ""}"`,
  );
}

export const COLOR_GROUP_LABELS: Record<ColorGroup, string> = {
  health: "Health & Body",
  mental: "Mind & Reflection",
  productivity: "Productivity & Growth",
  financial: "Financial",
  social: "Social & Relationships",
  home: "Home & Environment",
};
