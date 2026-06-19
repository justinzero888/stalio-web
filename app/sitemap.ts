import type { MetadataRoute } from "next";
import { getAllHabits } from "@/lib/habits/data";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const habitPages: MetadataRoute.Sitemap = getAllHabits().map((h) => ({
    url: `${siteUrl}/library/${h.habitId}`,
    lastModified: now,
    priority: 0.7,
  }));

  return [
    { url: siteUrl, lastModified: now, priority: 1 },
    { url: `${siteUrl}/library`, lastModified: now, priority: 0.9 },
    ...habitPages,
  ];
}
