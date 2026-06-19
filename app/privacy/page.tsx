import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Stalio and Orbace Technologies handle your data.",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-4xl tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink/50">
        Placeholder — final legal copy pending. Orbace Technologies LLC.
      </p>
      <div className="mt-8 space-y-4 text-ink/70">
        <p>
          The Stalio website is a static, read-only marketing site and habit
          library. It does not require an account and does not collect personal
          information through forms.
        </p>
        <p>
          The only data stored in your browser is a local list of habits you
          mark as &ldquo;added,&rdquo; kept in your device&apos;s local storage
          to remember your selections. It never leaves your device and is not
          sent to any server.
        </p>
        <p>
          For questions about this policy, contact Orbace Technologies.
        </p>
      </div>
    </article>
  );
}
