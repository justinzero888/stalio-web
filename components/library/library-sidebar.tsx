"use client";

import { IconSearch } from "@tabler/icons-react";
import type { Filters } from "@/lib/habits/filters";
import type { CategoryCounts } from "@/lib/habits/filters";
import {
  COLOR_GROUP_ORDER,
  COLOR_GROUP_TOKENS,
  COLOR_GROUP_SHORT,
} from "@/lib/habits/category";
import { FILTER_BUCKETS, BUCKET_LABEL } from "@/lib/habits/tracking";
import type { Difficulty } from "@/types/tracking";

const DIFFICULTIES: Difficulty[] = ["easy", "moderate", "hard"];

export function LibrarySidebar({
  filters,
  onChange,
  counts,
  bundleCount,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  counts: CategoryCounts;
  bundleCount: number;
}) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
      {/* search */}
      <div className="relative">
        <IconSearch
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search habits…"
          aria-label="Search habits"
          className="w-full rounded-r12 border border-ink/10 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-mint"
        />
      </div>

      {/* tracking method */}
      <Group label="Tracking method">
        <div className="flex flex-wrap gap-1.5">
          <Pill
            active={filters.bucket === "all"}
            onClick={() => onChange({ bucket: "all" })}
          >
            All
          </Pill>
          {FILTER_BUCKETS.map((b) => (
            <Pill
              key={b}
              active={filters.bucket === b}
              onClick={() => onChange({ bucket: b })}
            >
              {BUCKET_LABEL[b]}
            </Pill>
          ))}
        </div>
      </Group>

      {/* category */}
      <Group label="Category">
        <div className="space-y-0.5">
          <CatRow
            active={filters.colorGroup === "all"}
            dot="var(--color-ink)"
            label="All habits"
            count={counts.all}
            onClick={() => onChange({ colorGroup: "all" })}
          />
          {COLOR_GROUP_ORDER.map((g) => (
            <CatRow
              key={g}
              active={filters.colorGroup === g}
              dot={COLOR_GROUP_TOKENS[g].accent}
              label={COLOR_GROUP_SHORT[g]}
              count={counts.byGroup[g]}
              onClick={() => onChange({ colorGroup: g })}
            />
          ))}
        </div>
      </Group>

      {/* difficulty */}
      <Group label="Difficulty">
        <div className="flex flex-wrap gap-1.5">
          <Pill
            active={filters.difficulty === "all"}
            onClick={() => onChange({ difficulty: "all" })}
          >
            All
          </Pill>
          {DIFFICULTIES.map((d) => (
            <Pill
              key={d}
              active={filters.difficulty === d}
              onClick={() => onChange({ difficulty: d })}
            >
              {d[0].toUpperCase() + d.slice(1)}
            </Pill>
          ))}
        </div>
      </Group>

      {/* bundle toggle */}
      <button
        type="button"
        onClick={() => onChange({ bundleOnly: !filters.bundleOnly })}
        aria-pressed={filters.bundleOnly}
        className="flex w-full items-center justify-between rounded-r12 border p-3 text-left transition-colors"
        style={{
          borderColor: filters.bundleOnly
            ? "var(--color-mint)"
            : "rgba(26,26,46,.1)",
          background: filters.bundleOnly ? "var(--color-mint-bg)" : "white",
        }}
      >
        <span className="text-sm font-medium">Default bundle only</span>
        <span className="rounded-pill bg-ink/5 px-2 py-0.5 text-xs font-semibold text-ink/60">
          {bundleCount} habits
        </span>
      </button>
    </aside>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink/40">
        {label}
      </div>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-pill px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-ink text-white"
          : "border border-ink/10 text-ink/60 hover:bg-ink/5"
      }`}
    >
      {children}
    </button>
  );
}

function CatRow({
  active,
  dot,
  label,
  count,
  onClick,
}: {
  active: boolean;
  dot: string;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-2.5 rounded-r8 px-2.5 py-2 text-sm transition-colors ${
        active ? "bg-ink/5 font-medium" : "hover:bg-ink/[0.03]"
      }`}
    >
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ background: dot }}
      />
      <span className="flex-1 text-left">{label}</span>
      <span className="text-xs text-ink/40">{count}</span>
    </button>
  );
}
