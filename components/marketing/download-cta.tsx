import Link from "next/link";
import { IconBrandApple, IconBrandAndroid } from "@tabler/icons-react";

const IOS = process.env.NEXT_PUBLIC_APP_STORE_URL || "#";
const ANDROID = process.env.NEXT_PUBLIC_PLAY_STORE_URL || "#";

export function DownloadCTA() {
  return (
    <section
      id="download"
      className="relative overflow-hidden bg-ink text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-[28rem] -translate-x-1/2 rounded-full bg-mint/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
        <div className="text-sm font-semibold uppercase tracking-widest text-mint/60">
          Get started
        </div>
        <h2 className="mt-4 font-display text-[clamp(32px,5vw,60px)] leading-tight tracking-tight">
          Start today.
          <br />
          Not after you <em className="italic">plan</em> to.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/60">
          Download Stalio free. Your first habits are waiting. No credit card,
          no setup, no excuses.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={IOS}
            className="inline-flex h-12 items-center gap-2 rounded-pill bg-mint px-8 font-medium text-ink transition-colors hover:bg-mint-dim"
          >
            <IconBrandApple size={20} /> Download for iOS
          </Link>
          <Link
            href={ANDROID}
            className="inline-flex h-12 items-center gap-2 rounded-pill border border-white/20 px-8 font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            <IconBrandAndroid size={20} /> Download for Android
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/30">
          Free · No credit card · Works offline
        </p>
      </div>
    </section>
  );
}
