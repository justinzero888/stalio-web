import type { Habit } from "@/types/habit";
import type { ColorGroup } from "@/types/tracking";
import generated from "@/lib/habits/habits.generated.json";

const HABITS = generated as Habit[];

export function getAllHabits(): Habit[] {
  return HABITS;
}

export function getHabit(habitId: string): Habit | undefined {
  return HABITS.find((h) => h.habitId === habitId);
}

export function getDefaultBundle(): Habit[] {
  return HABITS.filter((h) => h.isDefaultBundle);
}

export function getHabitsByColorGroup(): Record<ColorGroup, Habit[]> {
  const out = {} as Record<ColorGroup, Habit[]>;
  for (const h of HABITS) {
    (out[h.colorGroup] ??= []).push(h);
  }
  return out;
}

export const HABIT_COUNT = HABITS.length;
export const DEFAULT_BUNDLE_COUNT = HABITS.filter(
  (h) => h.isDefaultBundle,
).length;
