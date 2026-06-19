"use client";

import { useEffect, useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
  IconDownload,
  IconCheck,
  IconStarFilled,
  IconClock,
  IconArrowRight,
} from "@tabler/icons-react";
import type { Habit } from "@/types/habit";
import { COLOR_GROUP_TOKENS } from "@/lib/habits/category";
import { trackingLabel } from "@/lib/habits/tracking";
import { habitIcon } from "@/components/library/habit-icon";
import { TrackingDemo } from "@/components/library/tracking-demo";
import { useAddedHabits } from "@/lib/store/added-habits";
import { useToast } from "@/lib/store/toast";
import { buildAddToAppUrl } from "@/lib/deeplink";

const DIFF_LABEL = { easy: "Easy", moderate: "Moderate", hard: "Hard" } as const;

export function HabitCard({ habit }: { habit: Habit }) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ids = useAddedHabits((s) => s.ids);
  const add = useAddedHabits((s) => s.add);
  const showToast = useToast((s) => s.show);

  useEffect(() => setMounted(true), []);
  const added = mounted && ids.includes(habit.habitId);

  const c = COLOR_GROUP_TOKENS[habit.colorGroup];
  const Icon = habitIcon(habit.categoryNameEn);

  const onAdd = () => {
    if (added) {
      showToast(`"${habit.nameEn}" is already in your app`);
      return;
    }
    add(habit.habitId);
    showToast(`"${habit.nameEn}" added to your Stalio app`);
    const url = buildAddToAppUrl(habit.habitId);
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <div
      className="overflow-hidden rounded-card border border-ink/[0.08] bg-white shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
      id={`hc-${habit.habitId}`}
    >
      <div className="h-1" style={{ background: c.accent }} />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-r12"
            style={{ background: c.bg }}
          >
            <Icon size={20} style={{ color: c.accent }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{habit.nameEn}</h3>
              {habit.isDefaultBundle && (
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: c.bg, color: c.text }}
                >
                  <IconStarFilled size={8} /> Bundle
                </span>
              )}
            </div>
            <div
              className="mt-0.5 text-xs font-medium"
              style={{ color: c.accent }}
            >
              {habit.categoryGroupEn}
            </div>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-ink/70">
          {habit.whatToDoEn}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Tag>{trackingLabel(habit.trackingType)}</Tag>
            <Tag accent={habit.difficulty === "easy" ? c.accent : undefined}>
              {DIFF_LABEL[habit.difficulty]}
            </Tag>
            {habit.timeOfDay && <Tag>{habit.timeOfDay}</Tag>}
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={expanded ? "Show less" : "Show details"}
              className="flex size-9 items-center justify-center rounded-r8 border border-ink/10 text-ink/60 transition-colors hover:bg-ink/5"
            >
              {expanded ? (
                <IconChevronUp size={18} />
              ) : (
                <IconInfoCircle size={18} />
              )}
            </button>
            <button
              type="button"
              onClick={onAdd}
              aria-label={added ? "Added to app" : "Add to app"}
              className="flex size-9 items-center justify-center rounded-r8 transition-colors"
              style={{
                background: added ? c.bg : "var(--color-mint)",
                color: added ? c.text : "var(--color-ink)",
              }}
            >
              {added ? <IconCheck size={18} /> : <IconDownload size={18} />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-ink/[0.06] bg-paper/40 p-5">
          {/* anatomy bar */}
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <AnatomyStep label="Cue" value={habit.anatomyCueEn} />
            <IconArrowRight
              size={16}
              className="mx-auto shrink-0 rotate-90 text-ink/30 sm:rotate-0"
            />
            <AnatomyStep
              label="Behaviour"
              value={habit.anatomyBehaviourEn}
              bg={c.bg}
              fg={c.text}
              labelColor={c.accent}
            />
            <IconArrowRight
              size={16}
              className="mx-auto shrink-0 rotate-90 text-ink/30 sm:rotate-0"
            />
            <AnatomyStep label="Reward" value={habit.anatomyRewardEn} />
          </div>

          {/* 2-minute version */}
          <div className="mt-4 flex items-start gap-3 rounded-r12 bg-ink p-4 text-white">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint/15">
              <IconClock size={16} className="text-mint" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-mint">
                2-minute version
              </div>
              <div className="mt-0.5 text-sm">{habit.twoMinEn}</div>
            </div>
          </div>

          {/* tracking viz */}
          <div className="mt-4 flex items-center gap-3 rounded-r12 border border-ink/[0.08] bg-white p-4">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-r8"
              style={{ background: c.bg }}
            >
              <Icon size={18} style={{ color: c.accent }} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">
                {trackingLabel(habit.trackingType)}
              </div>
              <div className="text-xs text-ink/50">
                {habit.trackingDefaultTarget
                  ? `Target: ${habit.trackingDefaultTarget} ${habit.trackingUnit ?? ""} · `
                  : ""}
                {habit.timeOfDay}
              </div>
            </div>
            <TrackingDemo habit={habit} accent={c.accent} />
          </div>

          {/* details */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Block label="What to do" value={habit.whatToDoEn} />
            <Block label="Why it works" value={habit.whyItWorksEn} />
            <div className="sm:col-span-2">
              <Block
                label="Research backing"
                value={habit.researchBackingEn}
                muted
              />
              {habit.researchSourceUrl && (
                <a
                  href={habit.researchSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs font-medium text-mint-dim hover:underline"
                >
                  View source
                </a>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={onAdd}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill py-3 font-medium transition-colors"
            style={{
              background: added ? c.bg : "var(--color-mint)",
              color: added ? c.text : "var(--color-ink)",
            }}
          >
            {added ? <IconCheck size={18} /> : <IconDownload size={18} />}
            {added ? "Added to your app" : "Add to Stalio app"}
          </button>
        </div>
      )}
    </div>
  );
}

function Tag({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <span
      className="rounded-md border px-2 py-0.5 text-[11px] font-medium"
      style={{
        borderColor: accent ? `${accent}40` : "rgba(26,26,46,.12)",
        color: accent ?? "rgba(26,26,46,.6)",
      }}
    >
      {children}
    </span>
  );
}

function AnatomyStep({
  label,
  value,
  bg,
  fg,
  labelColor,
}: {
  label: string;
  value: string | null;
  bg?: string;
  fg?: string;
  labelColor?: string;
}) {
  return (
    <div
      className="flex-1 rounded-r12 border border-ink/[0.06] p-3"
      style={{ background: bg ?? "white" }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: labelColor ?? "rgba(26,26,46,.4)" }}
      >
        {label}
      </div>
      <div className="mt-0.5 text-xs" style={{ color: fg ?? "var(--color-ink)" }}>
        {value}
      </div>
    </div>
  );
}

function Block({
  label,
  value,
  muted,
}: {
  label: string;
  value: string | null;
  muted?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink/40">
        {label}
      </div>
      <p
        className={`mt-1 text-sm leading-relaxed ${muted ? "text-ink/45" : "text-ink/70"}`}
      >
        {value}
      </p>
    </div>
  );
}
