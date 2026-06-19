const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "";
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "";

function withUtm(url: string, habitId: string): string {
  if (!url) return "";
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}utm_source=web_library&utm_habit=${encodeURIComponent(habitId)}`;
}

/**
 * Returns the best available "Add to Stalio app" target for a habit.
 * Until the mobile team provides Universal/App Link values (ADR-5), this is the
 * store listing with UTM attribution. Returns null if no store URL is configured.
 */
export function buildAddToAppUrl(habitId: string): string | null {
  const base = APP_STORE_URL || PLAY_STORE_URL;
  return base ? withUtm(base, habitId) : null;
}

export function storeUrls(habitId?: string) {
  return {
    ios: habitId ? withUtm(APP_STORE_URL, habitId) : APP_STORE_URL,
    android: habitId ? withUtm(PLAY_STORE_URL, habitId) : PLAY_STORE_URL,
  };
}
