"use client";

import type { Habit } from "@/types/habit";
import { trackingBucket } from "@/lib/habits/tracking";

export function TrackingDemo({
  habit,
  accent,
}: {
  habit: Habit;
  accent: string;
}) {
  const bucket = trackingBucket(habit.trackingType);

  if (bucket === "boolean") {
    return (
      <div className="flex gap-1.5">
        {[true, true, false, true, true].map((done, i) => (
          <span
            key={i}
            className="flex size-6 items-center justify-center rounded-md text-[11px] font-bold text-white"
            style={{ background: done ? accent : "rgba(26,26,46,.08)" }}
          >
            {done ? "✓" : "−"}
          </span>
        ))}
      </div>
    );
  }

  if (bucket === "duration") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full"
            style={{ width: "75%", background: accent }}
          />
        </div>
        <span className="text-xs font-semibold" style={{ color: accent }}>
          {habit.trackingDefaultTarget ?? ""} {habit.trackingUnit ?? ""}
        </span>
      </div>
    );
  }

  if (bucket === "volume") {
    const bars = [8, 10, 12, 11, 9, 14];
    return (
      <div className="flex items-end gap-1">
        {bars.map((v, i) => (
          <span
            key={i}
            className="w-1.5 rounded-sm"
            style={{
              height: `${Math.round((v / 14) * 28) + 6}px`,
              background: accent,
              opacity: 0.4 + (v / 14) * 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  if (bucket === "scale") {
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="size-3 rounded-full"
            style={{
              background: i <= 3 ? accent : "rgba(26,26,46,.1)",
              opacity: i <= 3 ? 0.4 + i * 0.15 : 1,
            }}
          />
        ))}
      </div>
    );
  }

  if (bucket === "streak") {
    return (
      <div className="text-sm font-bold" style={{ color: accent }}>
        🔥 14 days
      </div>
    );
  }

  if (bucket === "time") {
    return (
      <div className="text-sm font-semibold" style={{ color: accent }}>
        10:32pm
      </div>
    );
  }

  return (
    <div
      className="rounded-md border border-dashed px-2 py-1 text-xs"
      style={{ borderColor: accent, color: accent }}
    >
      Write it down
    </div>
  );
}
