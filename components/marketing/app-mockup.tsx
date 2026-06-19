"use client";

import { useState } from "react";
import {
  IconCheck,
  IconFlame,
  IconRun,
  IconDroplet,
  IconBrain,
  IconSalad,
} from "@tabler/icons-react";

interface MockHabit {
  id: string;
  name: string;
  detail: string;
  badge: string;
  tint: string;
  icon: typeof IconCheck;
  done: boolean;
}

const INITIAL: MockHabit[] = [
  { id: "m1", name: "Move your body", detail: "30 min · done at 7:22am", badge: "✓", tint: "#00E5A0", icon: IconRun, done: true },
  { id: "m2", name: "Drink enough water", detail: "6 of 8 glasses", badge: "6/8", tint: "#72B4F0", icon: IconDroplet, done: true },
  { id: "m3", name: "Take a moment", detail: "5–10 min · not yet", badge: "—", tint: "#AFA9EC", icon: IconBrain, done: false },
  { id: "m4", name: "Eat well today", detail: "Evening check-in", badge: "—", tint: "#FFB84D", icon: IconSalad, done: false },
];

export function AppMockup() {
  const [habits, setHabits] = useState(INITIAL);
  const done = habits.filter((h) => h.done).length;
  const pct = Math.round((done / habits.length) * 100);

  const toggle = (id: string) =>
    setHabits((hs) =>
      hs.map((h) => (h.id === id ? { ...h, done: !h.done } : h)),
    );

  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[28px] border border-white/10 bg-[#15152a] p-4 shadow-[0_24px_60px_rgba(0,0,0,.4)]">
      <div className="mb-4 flex items-center justify-between px-1">
        <span className="text-xs font-medium text-white/40">Today</span>
        <span className="font-display text-lg text-white">Your day</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-amber">
          <IconFlame size={14} /> 14
        </span>
      </div>

      <ul className="space-y-2">
        {habits.map((h) => {
          const Icon = h.icon;
          return (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => toggle(h.id)}
                aria-pressed={h.done}
                aria-label={`${h.name}, ${h.done ? "done" : "not done"}`}
                className="flex w-full items-center gap-3 rounded-r12 bg-white/[0.04] p-3 text-left transition-colors hover:bg-white/[0.07]"
              >
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                  style={{
                    borderColor: h.done ? "#00E5A0" : "rgba(255,255,255,.2)",
                    background: h.done ? "#00E5A0" : "transparent",
                  }}
                >
                  {h.done && <IconCheck size={15} className="text-ink" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">
                    {h.name}
                  </span>
                  <span className="block truncate text-xs text-white/40">
                    {h.detail}
                  </span>
                </span>
                <Icon size={16} style={{ color: h.tint }} className="shrink-0" />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 px-1">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-white/50">Today&apos;s progress</span>
          <span className="font-semibold text-mint">{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-mint transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
