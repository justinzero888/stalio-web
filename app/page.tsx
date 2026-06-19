import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HABIT_COUNT, DEFAULT_BUNDLE_COUNT } from "@/lib/habits/data";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-mint">
          A do-first habit app
        </p>
        <h1 className="max-w-3xl font-display text-[clamp(40px,5vw,66px)] leading-[1.08] tracking-tight">
          Build the life you keep promising yourself
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/70">
          Stalio ships with pre-loaded universal habits on day one — zero setup.
          Browse the full habit library and start today.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/library">
            <Button size="lg">Download free</Button>
          </Link>
          <Link href="/library">
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Explore the library
            </Button>
          </Link>
        </div>

        <dl className="mt-14 flex flex-wrap gap-10">
          {[
            [String(HABIT_COUNT), "habits in the library"],
            [String(DEFAULT_BUNDLE_COUNT), "pre-loaded on day one"],
            ["0", "minutes of setup"],
          ].map(([n, label]) => (
            <div key={label}>
              <dt className="font-display text-4xl text-mint">{n}</dt>
              <dd className="text-sm text-white/60">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
