import { describe, it, expect } from "vitest";
import { getAllHabits } from "@/lib/habits/data";
import {
  DEFAULT_FILTERS,
  filterHabits,
  categoryCounts,
} from "@/lib/habits/filters";

const habits = getAllHabits();

describe("filterHabits", () => {
  it("returns all 54 habits with default filters", () => {
    expect(filterHabits(habits, DEFAULT_FILTERS)).toHaveLength(54);
  });

  it("filters the default bundle", () => {
    const bundle = filterHabits(habits, {
      ...DEFAULT_FILTERS,
      bundleOnly: true,
    });
    expect(bundle).toHaveLength(9);
    expect(bundle.every((h) => h.isDefaultBundle)).toBe(true);
  });

  it("searches name and description", () => {
    const res = filterHabits(habits, { ...DEFAULT_FILTERS, search: "floss" });
    expect(res.length).toBeGreaterThan(0);
    expect(res.some((h) => h.nameEn === "Floss")).toBe(true);
    expect(res.some((h) => h.nameEn === "Drink water")).toBe(false);
  });

  it("filters by color group", () => {
    const res = filterHabits(habits, {
      ...DEFAULT_FILTERS,
      colorGroup: "financial",
    });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((h) => h.colorGroup === "financial")).toBe(true);
  });
});

describe("categoryCounts", () => {
  it("all count equals total with default filters", () => {
    const c = categoryCounts(habits, DEFAULT_FILTERS);
    expect(c.all).toBe(54);
    const sum = Object.values(c.byGroup).reduce((a, b) => a + b, 0);
    expect(sum).toBe(54);
  });

  it("respects search when counting", () => {
    const c = categoryCounts(habits, { ...DEFAULT_FILTERS, search: "floss" });
    expect(c.all).toBeLessThan(54);
  });
});
