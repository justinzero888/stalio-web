import type { Metadata } from "next";
import { HABIT_COUNT, getHabitsByColorGroup } from "@/lib/habits/data";
import { COLOR_GROUP_LABELS } from "@/lib/habits/color-group";
import type { ColorGroup } from "@/types/tracking";

export const metadata: Metadata = {
  title: "Habit Library",
  description:
    "Browse Stalio's growing, research-backed habit library. Filter by category, tracking method, and difficulty.",
};

// Static (ADR-8): rendered at build time from the consolidated CSV.
// M4 replaces this preview with the full sidebar + expandable cards.
export default function LibraryPage() {
  const grouped = getHabitsByColorGroup();
  const groups = Object.keys(grouped) as ColorGroup[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-[36px] leading-tight tracking-tight">
        Habit Library
      </h1>
      <p className="mt-3 max-w-xl text-ink/60">
        {HABIT_COUNT} research-backed habits. The full searchable, filterable
        experience lands in milestone M4 — the data layer and design tokens are
        in place.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <section key={g}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
              {COLOR_GROUP_LABELS[g]} ({grouped[g].length})
            </h2>
            <ul className="space-y-1.5">
              {grouped[g].map((h) => (
                <li key={h.habitId} className="text-sm text-ink/80">
                  {h.nameEn}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
