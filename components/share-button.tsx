"use client";

import { useState } from "react";

interface ShareButtonProps {
  getLink: () => string;
  disabled?: boolean;
}

export function ShareButton({ getLink, disabled }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    const link = getLink();
    if (!link) {
      setStatus("failed");
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const input = document.createElement("input");
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }

      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <button type="button" className="button-secondary" onClick={handleCopy} disabled={disabled}>
      {status === "copied" ? "Share link copied" : status === "failed" ? "Copy failed" : "Copy Share Link"}
    </button>
  );
}
