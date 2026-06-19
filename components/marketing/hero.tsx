import Link from "next/link";
import { IconBrandApple, IconBooks } from "@tabler/icons-react";
import { AppMockup } from "@/components/marketing/app-mockup";
import { HABIT_COUNT, DEFAULT_BUNDLE_COUNT } from "@/lib/habits/data";

const STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "#download";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-mint/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 size-96 rounded-full bg-[#534AB7]/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-mint">
            <span className="size-1.5 rounded-full bg-mint" />
            The do-first habit app
          </div>
          <h1 className="font-display text-[clamp(40px,5vw,66px)] leading-[1.08] tracking-tight">
            Build the life you keep
            <br />
            <em className="italic">promising yourself</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Stalio ships you {DEFAULT_BUNDLE_COUNT} pre-loaded habits on day one.
            No setup, no planning sessions, no journaling. Just open the app and
            start doing.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={STORE_URL}
              className="inline-flex h-12 items-center gap-2 rounded-pill bg-mint px-6 font-medium text-ink transition-colors hover:bg-mint-dim"
            >
              <IconBrandApple size={20} /> Download free
            </Link>
            <Link
              href="/library"
              className="inline-flex h-12 items-center gap-2 rounded-pill border border-white/20 px-6 font-medium text-white transition-colors hover:bg-white/10"
            >
              <IconBooks size={20} /> Browse habit library
            </Link>
          </div>

          <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-6">
            {[
              [String(HABIT_COUNT), "habits in the library"],
              [String(DEFAULT_BUNDLE_COUNT), "pre-loaded on day one"],
              ["0", "minutes of setup required"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="font-display text-4xl text-mint">{n}</dt>
                <dd className="text-sm text-white/50">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <AppMockup />
        </div>
      </div>
    </section>
  );
}
