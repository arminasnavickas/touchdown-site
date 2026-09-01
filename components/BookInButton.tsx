"use client";

import { useBooking } from "./BookingContext";

// Single source of truth for the site's one primary CTA — one copy
// convention ("Book your dive"), one size, one padding scale, used
// everywhere. Call sites pass `className` for layout/positioning only
// (w-full, mx-auto, shadow-lg, etc.) — it's appended after BASE_CLASSES,
// never replaces it, so no call site can quietly drift to a different
// size or padding again. Pass `children` only when the button truly needs
// different content (e.g. a per-tier aria-label on the pricing cards still
// renders the same visible "Book your dive" text); otherwise the shared
// default (label + arrow) is used.
const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-[6px] bg-cta px-8 py-4 text-center font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue hover:scale-105 hover:shadow-lg hover:shadow-cta/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2";

export default function BookInButton({
  className = "",
  children,
  ...rest
}: {
  className?: string;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openBooking } = useBooking();

  return (
    <button type="button" onClick={openBooking} className={`${BASE_CLASSES} ${className}`.trim()} {...rest}>
      {children ?? (
        <>
          Book your dive
          <span aria-hidden>→</span>
        </>
      )}
    </button>
  );
}
