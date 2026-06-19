"use client";

import { useEffect, useState } from "react";
import { IconCircleCheck } from "@tabler/icons-react";
import { useToast } from "@/lib/store/toast";

export function Toaster() {
  const message = useToast((s) => s.message);
  const seq = useToast((s) => s.seq);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (seq === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [seq]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-pill bg-ink px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-lg)] transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <IconCircleCheck size={18} className="text-mint" />
      {message}
    </div>
  );
}
