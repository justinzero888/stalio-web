import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Stalio website.",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-4xl tracking-tight">Terms of Use</h1>
      <p className="mt-2 text-sm text-ink/50">
        Placeholder — final legal copy pending. Orbace Technologies LLC.
      </p>
      <div className="mt-8 space-y-4 text-ink/70">
        <p>
          The Stalio website and habit library are provided for informational
          purposes. Habit descriptions and research notes are general guidance,
          not medical, financial, or professional advice.
        </p>
        <p>
          The content is owned by Orbace Technologies LLC. The Stalio name and
          branding may not be used without permission.
        </p>
        <p>
          For questions about these terms, contact Orbace Technologies.
        </p>
      </div>
    </article>
  );
}
