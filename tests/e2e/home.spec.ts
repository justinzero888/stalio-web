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

test("library page is reachable", async ({ page }) => {
  await page.goto("/library");
  await expect(
    page.getByRole("heading", { name: /Habit Library/i }),
  ).toBeVisible();
});
