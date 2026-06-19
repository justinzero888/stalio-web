import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconChevronRight, IconArrowRight, IconClock } from "@tabler/icons-react";
import { getAllHabits, getHabit } from "@/lib/habits/data";
import { COLOR_GROUP_TOKENS } from "@/lib/habits/category";
import { trackingLabel } from "@/lib/habits/tracking";
import { habitIcon } from "@/components/library/habit-icon";
import { TrackingDemo } from "@/components/library/tracking-demo";
import { AddToAppButton } from "@/components/library/add-to-app-button";
import { Toaster } from "@/components/library/toaster";

export const dynamicParams = false;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return getAllHabits().map((h) => ({ habitId: h.habitId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ habitId: string }>;
}): Promise<Metadata> {
  const { habitId } = await params;
  const habit = getHabit(habitId);
  if (!habit) return {};
  const description = (habit.whatToDoEn ?? habit.nameEn).slice(0, 155);
  return {
    title: habit.nameEn,
    description,
    alternates: { canonical: `/library/${habit.habitId}` },
    openGraph: {
      title: `${habit.nameEn} · Stalio`,
      description,
      url: `${SITE_URL}/library/${habit.habitId}`,
      type: "article",
    },
  };
}

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ habitId: string }>;
}) {
  const { habitId } = await params;
  const habit = getHabit(habitId);
  if (!habit) notFound();

  const c = COLOR_GROUP_TOKENS[habit.colorGroup];
  const Icon = habitIcon(habit.categoryNameEn);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: habit.nameEn,
        description: habit.whatToDoEn ?? undefined,
        articleSection: habit.categoryGroupEn,
        url: `${SITE_URL}/library/${habit.habitId}`,
        publisher: {
          "@type": "Organization",
          name: "Orbace Technologies",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Habit Library",
            item: `${SITE_URL}/library`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: habit.nameEn,
            item: `${SITE_URL}/library/${habit.habitId}`,
          },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-ink/50"
      >
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <IconChevronRight size={14} />
        <Link href="/library" className="hover:text-ink">
          Habit Library
        </Link>
        <IconChevronRight size={14} />
        <span className="truncate text-ink">{habit.nameEn}</span>
      </nav>

      {/* header */}
      <header className="mt-6 flex items-start gap-4">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-r16"
          style={{ background: c.bg }}
        >
          <Icon size={28} style={{ color: c.accent }} />
        </div>
        <div>
          <div className="text-sm font-medium" style={{ color: c.accent }}>
            {habit.categoryGroupEn} · {habit.categoryNameEn}
          </div>
          <h1 className="mt-1 font-display text-[clamp(28px,4vw,44px)] leading-tight tracking-tight">
            {habit.nameEn}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
            <Chip>{trackingLabel(habit.trackingType)}</Chip>
            <Chip>
              {habit.difficulty[0].toUpperCase() + habit.difficulty.slice(1)}
            </Chip>
            {habit.timeOfDay && <Chip>{habit.timeOfDay}</Chip>}
            {habit.isDefaultBundle && (
              <span
                className="rounded-md px-2 py-0.5 font-semibold"
                style={{ background: c.bg, color: c.text }}
              >
                Default bundle
              </span>
            )}
          </div>
        </div>
      </header>

      {/* anatomy */}
      <section className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <Step label="Cue" value={habit.anatomyCueEn} />
        <IconArrowRight
          size={16}
          className="mx-auto rotate-90 text-ink/30 sm:rotate-0"
        />
        <Step
          label="Behaviour"
          value={habit.anatomyBehaviourEn}
          bg={c.bg}
          fg={c.text}
          labelColor={c.accent}
        />
        <IconArrowRight
          size={16}
          className="mx-auto rotate-90 text-ink/30 sm:rotate-0"
        />
        <Step label="Reward" value={habit.anatomyRewardEn} />
      </section>

      {/* 2-minute */}
      <div className="mt-6 flex items-start gap-3 rounded-r16 bg-ink p-5 text-white">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint/15">
          <IconClock size={18} className="text-mint" />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-mint">
            2-minute version
          </div>
          <div className="mt-1">{habit.twoMinEn}</div>
        </div>
      </div>

      {/* tracking */}
      <div className="mt-6 flex items-center gap-3 rounded-r16 border border-ink/[0.08] bg-white p-5">
        <div className="flex-1">
          <div className="font-medium">{trackingLabel(habit.trackingType)}</div>
          <div className="text-sm text-ink/50">
            {habit.trackingDefaultTarget
              ? `Target: ${habit.trackingDefaultTarget} ${habit.trackingUnit ?? ""} · `
              : ""}
            {habit.timeOfDay}
          </div>
        </div>
        <TrackingDemo habit={habit} accent={c.accent} />
      </div>

      {/* prose */}
      <Section label="What to do" body={habit.whatToDoEn} />
      <Section label="Why it works" body={habit.whyItWorksEn} />
      <Section label="Research backing" body={habit.researchBackingEn} muted>
        {habit.researchSourceUrl && (
          <a
            href={habit.researchSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-medium text-mint-dim hover:underline"
          >
            View source
          </a>
        )}
      </Section>

      {/* CTA */}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-8">
        <AddToAppButton
          habitId={habit.habitId}
          habitName={habit.nameEn}
          bg={c.bg}
          text={c.text}
        />
        <Link
          href="/library"
          className="text-sm font-medium text-ink/60 hover:text-ink"
        >
          ← Back to library
        </Link>
      </div>

      <Toaster />
    </article>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-ink/12 px-2 py-0.5 font-medium text-ink/60">
      {children}
    </span>
  );
}

function Step({
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
      <div className="mt-0.5 text-sm" style={{ color: fg ?? "var(--color-ink)" }}>
        {value}
      </div>
    </div>
  );
}

function Section({
  label,
  body,
  muted,
  children,
}: {
  label: string;
  body: string | null;
  muted?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink/40">
        {label}
      </div>
      <p
        className={`mt-1.5 leading-relaxed ${muted ? "text-ink/50" : "text-ink/75"}`}
      >
        {body}
      </p>
      {children}
    </section>
  );
}
