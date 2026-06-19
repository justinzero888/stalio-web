"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Habit } from "@/types/habit";
import type { ColorGroup, Difficulty } from "@/types/tracking";
import {
  DEFAULT_FILTERS,
  type Filters,
  type SortKey,
  filterHabits,
  categoryCounts,
} from "@/lib/habits/filters";
import { COLOR_GROUP_ORDER } from "@/lib/habits/category";
import { FILTER_BUCKETS, type TrackingBucket } from "@/lib/habits/tracking";
import { LibrarySidebar } from "@/components/library/library-sidebar";
import { HabitCard } from "@/components/library/habit-card";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default order" },
  { key: "az", label: "Name A–Z" },
  { key: "za", label: "Name Z–A" },
  { key: "easy", label: "Easiest first" },
  { key: "hard", label: "Hardest first" },
  { key: "bundle", label: "Bundle first" },
];

function parseFilters(sp: URLSearchParams): Filters {
  const cg = sp.get("cat");
  const tb = sp.get("track");
  const df = sp.get("diff");
  const sort = sp.get("sort");
  return {
    search: sp.get("q") ?? "",
    colorGroup: COLOR_GROUP_ORDER.includes(cg as ColorGroup)
      ? (cg as ColorGroup)
      : "all",
    bucket: FILTER_BUCKETS.includes(tb as TrackingBucket)
      ? (tb as TrackingBucket)
      : "all",
    difficulty: (["easy", "moderate", "hard"] as string[]).includes(df ?? "")
      ? (df as Difficulty)
      : "all",
    bundleOnly: sp.get("bundle") === "1",
    sort: (SORTS.map((s) => s.key) as string[]).includes(sort ?? "")
      ? (sort as SortKey)
      : "default",
  };
}

export function LibraryClient({ habits }: { habits: Habit[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() =>
    parseFilters(new URLSearchParams(sp.toString())),
  );

  const syncUrl = useCallback(
    (f: Filters) => {
      const p = new URLSearchParams();
      if (f.search) p.set("q", f.search);
      if (f.colorGroup !== "all") p.set("cat", f.colorGroup);
      if (f.bucket !== "all") p.set("track", f.bucket);
      if (f.difficulty !== "all") p.set("diff", f.difficulty);
      if (f.bundleOnly) p.set("bundle", "1");
      if (f.sort !== "default") p.set("sort", f.sort);
      const qs = p.toString();
      router.replace(qs ? `/library?${qs}` : "/library", { scroll: false });
    },
    [router],
  );

  const update = useCallback(
    (patch: Partial<Filters>) =>
      setFilters((prev) => {
        const next = { ...prev, ...patch };
        syncUrl(next);
        return next;
      }),
    [syncUrl],
  );

  const filtered = useMemo(
    () => filterHabits(habits, filters),
    [habits, filters],
  );
  const counts = useMemo(
    () => categoryCounts(habits, filters),
    [habits, filters],
  );
  const bundleCount = useMemo(
    () => habits.filter((h) => h.isDefaultBundle).length,
    [habits],
  );

  const hasActiveFilters =
    filters.search !== "" ||
    filters.colorGroup !== "all" ||
    filters.bucket !== "all" ||
    filters.difficulty !== "all" ||
    filters.bundleOnly;

  const clearAll = () => update({ ...DEFAULT_FILTERS });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <header className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-widest text-slate">
          Habit library
        </div>
        <h1 className="mt-2 font-display text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-tight">
          Every habit. Researched. <em className="italic">Ready to add.</em>
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <LibrarySidebar
          filters={filters}
          onChange={update}
          counts={counts}
          bundleCount={bundleCount}
        />

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-ink/60">
              Showing <strong className="text-ink">{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "habit" : "habits"}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-3 text-mint-dim hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-ink/50">Sort</span>
              <select
                value={filters.sort}
                onChange={(e) =>
                  update({ sort: e.target.value as SortKey })
                }
                className="rounded-r8 border border-ink/10 bg-white px-2 py-1.5 text-sm outline-none focus:border-mint"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-card border border-dashed border-ink/15 py-20 text-center">
              <div className="font-medium">No habits match</div>
              <p className="mt-1 text-sm text-ink/50">
                Try different filters or clear them to see all habits.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 rounded-pill bg-ink px-5 py-2 text-sm font-medium text-white"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((h) => (
                <HabitCard key={h.habitId} habit={h} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
