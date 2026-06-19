import {
  IconRocket,
  IconBooks,
  IconShieldCheck,
  IconUserCheck,
  IconUsers,
  IconChartLine,
} from "@tabler/icons-react";
import { HABIT_COUNT } from "@/lib/habits/data";

type TablerIcon = React.ComponentType<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  stroke?: number;
}>;

interface Feature {
  icon: TablerIcon;
  bg: string;
  fg: string;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: IconRocket,
    bg: "#E1F5EE",
    fg: "#085041",
    title: "Zero-setup start",
    body: "Open Stalio for the first time and your day is already waiting — universal habits pre-loaded and ready to check off. No onboarding questionnaire. No empty screen.",
  },
  {
    icon: IconBooks,
    bg: "#EEEDFE",
    fg: "#3C3489",
    title: "A growing habit library",
    body: `${HABIT_COUNT} habits across 6 categories — health, mindset, productivity, finance, social, and home. Each researched, described, and ready to add to your day in one tap.`,
  },
  {
    icon: IconShieldCheck,
    bg: "#FAEEDA",
    fg: "#633806",
    title: "Resilience over streaks",
    body: "Miss a day? Stalio doesn't reset your progress to zero. It shows a consistency score — how often you showed up over time. One hard week shouldn't erase 60 days of momentum.",
  },
  {
    icon: IconUserCheck,
    bg: "#E6F1FB",
    fg: "#0C447C",
    title: "Identity, not tasks",
    body: '"I am someone who moves their body" is a different motivation than "exercise 30 min." Every habit is framed around who you\'re becoming, not just what you\'re doing.',
  },
  {
    icon: IconUsers,
    bg: "#FBEAF0",
    fg: "#72243E",
    title: "Community-powered library",
    body: "The habit library grows with the community. The best, most-used habits get surfaced to everyone — so the library keeps getting better over time.",
  },
  {
    icon: IconChartLine,
    bg: "#EAF3DE",
    fg: "#27500A",
    title: "Insight over data",
    body: 'Stalio doesn\'t just track — it tells you what it notices. "Days you meditate, your consistency is 40% higher." Real patterns, plain language. No dashboards to decipher.',
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-widest text-slate">
          How Stalio works
        </div>
        <h2 className="mt-3 font-display text-[clamp(28px,3.5vw,44px)] leading-tight tracking-tight">
          Built for doing, not planning
        </h2>
        <p className="mt-4 text-ink/60">
          Most habit apps ask you to set goals, pick schedules, and design your
          perfect routine before you&apos;ve done a single thing. Stalio starts
          on the other end.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="rounded-card border border-ink/[0.08] bg-white p-6 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <div
                className="flex size-11 items-center justify-center rounded-r12"
                style={{ background: f.bg }}
              >
                <Icon size={22} style={{ color: f.fg }} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {f.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
