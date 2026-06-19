import { describe, it, expect } from "vitest";
import { deriveColorGroup } from "@/lib/habits/color-group";

describe("deriveColorGroup", () => {
  it("maps Health & Body (身) to health", () => {
    expect(deriveColorGroup("Health & Body", "身")).toBe("health");
  });

  it("splits Health & Body (心) into mental", () => {
    expect(deriveColorGroup("Health & Body", "心")).toBe("mental");
  });

  it("maps the remaining groups", () => {
    expect(deriveColorGroup("Productivity & Growth", "长")).toBe("productivity");
    expect(deriveColorGroup("Financial", "财")).toBe("financial");
    expect(deriveColorGroup("Social & Relationship", "缘")).toBe("social");
    expect(deriveColorGroup("Home & Environment", "居")).toBe("home");
  });

  it("throws on an unknown group", () => {
    expect(() => deriveColorGroup("Nonsense", null)).toThrow();
  });
});
