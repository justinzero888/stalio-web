import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Orbace Technologies LLC</p>
        <nav className="flex gap-6">
          <Link href="/library" className="hover:text-ink">
            Habit Library
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
