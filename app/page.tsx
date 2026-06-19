import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { DownloadCTA } from "@/components/marketing/download-cta";
import { HABIT_COUNT } from "@/lib/habits/data";
import { COLOR_GROUP_ORDER, COLOR_GROUP_TOKENS } from "@/lib/habits/category";
import { COLOR_GROUP_LABELS } from "@/lib/habits/color-group";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />

      {/* Library teaser */}
      <section className="bg-paper-2">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-slate">
            Habit library
          </div>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-[clamp(28px,3.5vw,44px)] leading-tight tracking-tight">
            Every habit. Researched. Ready to add.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">
            Browse all {HABIT_COUNT} habits across six categories. See the full
            anatomy, research backing, and tracking method — then add any habit
            to the app in one tap.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {COLOR_GROUP_ORDER.map((g) => {
              const c = COLOR_GROUP_TOKENS[g];
              return (
                <span
                  key={g}
                  className="rounded-pill px-3 py-1.5 text-sm font-medium"
                  style={{ background: c.bg, color: c.text }}
                >
                  {COLOR_GROUP_LABELS[g]}
                </span>
              );
            })}
          </div>
          <div className="mt-8">
            <Link
              href="/library"
              className="inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-8 font-medium text-white transition-colors hover:bg-ink/90"
            >
              Explore the library
            </Link>
          </div>
        </div>
      </section>

      <DownloadCTA />
    </>
  );
}
