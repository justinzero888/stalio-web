import { test, expect } from "@playwright/test";

test("homepage renders hero and primary CTA", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Build the life you keep promising yourself/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Download free/i }).first(),
  ).toBeVisible();
});

test("library lists habits and supports search", async ({ page }) => {
  await page.goto("/library");
  await expect(
    page.getByRole("heading", { name: /Every habit\. Researched/i }),
  ).toBeVisible();

  // a known seeded habit is present
  await expect(page.getByText("Drink water").first()).toBeVisible();

  // search narrows results
  await page.getByPlaceholder("Search habits").fill("floss");
  await expect(page.getByText("Floss").first()).toBeVisible();
  await expect(page.getByText("Drink water")).toHaveCount(0);
});

test("habit detail page renders", async ({ page }) => {
  await page.goto("/library/H001");
  await expect(
    page.getByRole("heading", { name: /Drink water/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Add to Stalio app/i }),
  ).toBeVisible();
});
