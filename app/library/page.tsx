import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllHabits } from "@/lib/habits/data";
import { LibraryClient } from "@/components/library/library-client";
import { Toaster } from "@/components/library/toaster";

export const metadata: Metadata = {
  title: "Habit Library",
  description:
    "Browse Stalio's research-backed habit library. Filter by category, tracking method, and difficulty, then add any habit to the app in one tap.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  const habits = getAllHabits();
  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        <LibraryClient habits={habits} />
      </Suspense>
      <Toaster />
    </>
  );
}
