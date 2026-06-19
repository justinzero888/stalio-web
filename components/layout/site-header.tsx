import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";

const STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "/#download";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-r8 bg-mint">
            <IconCheck size={16} className="text-ink" stroke={3} />
          </span>
          <span className="font-display text-2xl tracking-tight">Stalio</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/library" className="hidden hover:text-mint-dim sm:block">
            Habit Library
          </Link>
          <Link
            href={STORE_URL}
            className="rounded-pill bg-mint px-4 py-2 font-medium text-ink transition-colors hover:bg-mint-dim"
          >
            Download free
          </Link>
        </div>
      </nav>
    </header>
  );
}
