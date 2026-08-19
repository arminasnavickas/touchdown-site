"use client";

import { useState } from "react";
import { ShareIcon, CheckIcon } from "./BlogIcons";

export default function ShareButton({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled the native share sheet, or it failed - fall back
        // to copying the link instead of leaving the click with no result.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (unsupported browser/permissions) - nothing
      // more to do silently; the button just won't confirm anything.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center gap-1.5 font-switzer text-sm font-medium uppercase tracking-widest text-horizon transition hover:text-cta ${className ?? ""}`}
    >
      {copied ? (
        <>
          <CheckIcon className="size-4" /> Copied
        </>
      ) : (
        <>
          <ShareIcon className="size-4" /> Share
        </>
      )}
    </button>
  );
}
