import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center">
      <div className="font-display text-7xl text-mint">404</div>
      <h1 className="mt-4 font-display text-3xl tracking-tight">
        This page wandered off
      </h1>
      <p className="mt-3 text-ink/60">
        The page you&apos;re looking for doesn&apos;t exist. Try the habit
        library instead.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/library"
          className="rounded-pill bg-mint px-6 py-3 font-medium text-ink transition-colors hover:bg-mint-dim"
        >
          Browse the habit library
        </Link>
        <Link
          href="/"
          className="rounded-pill border border-ink/15 px-6 py-3 font-medium transition-colors hover:bg-ink/5"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
