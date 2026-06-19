"use client";

import { useEffect, useState } from "react";
import { IconDownload, IconCheck } from "@tabler/icons-react";
import { useAddedHabits } from "@/lib/store/added-habits";
import { useToast } from "@/lib/store/toast";
import { buildAddToAppUrl } from "@/lib/deeplink";

export function AddToAppButton({
  habitId,
  habitName,
  bg,
  text,
}: {
  habitId: string;
  habitName: string;
  bg: string;
  text: string;
}) {
  const [mounted, setMounted] = useState(false);
  const ids = useAddedHabits((s) => s.ids);
  const add = useAddedHabits((s) => s.add);
  const showToast = useToast((s) => s.show);
  useEffect(() => setMounted(true), []);
  const added = mounted && ids.includes(habitId);

  const onAdd = () => {
    if (added) {
      showToast(`"${habitName}" is already in your app`);
      return;
    }
    add(habitId);
    showToast(`"${habitName}" added to your Stalio app`);
    const url = buildAddToAppUrl(habitId);
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      className="inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 font-medium transition-colors"
      style={{
        background: added ? bg : "var(--color-mint)",
        color: added ? text : "var(--color-ink)",
      }}
    >
      {added ? <IconCheck size={18} /> : <IconDownload size={18} />}
      {added ? "Added to your app" : "Add to Stalio app"}
    </button>
  );
}
