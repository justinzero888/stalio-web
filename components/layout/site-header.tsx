import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Stalio
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/library" className="hover:text-mint-dim">
            Habit Library
          </Link>
          <Link
            href="/library"
            className="rounded-pill bg-mint px-4 py-2 font-medium text-ink hover:bg-mint-dim"
          >
            Download free
          </Link>
        </div>
      </nav>
    </header>
  );
}
