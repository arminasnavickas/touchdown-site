"use client";

import { useBooking } from "./BookingContext";

export default function BookInButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { openBooking } = useBooking();

  return (
    <button type="button" onClick={openBooking} className={className}>
      {children}
    </button>
  );
}
