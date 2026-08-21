"use client";

import { useBooking } from "./BookingContext";

export default function BookInButton({
  className,
  children,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openBooking } = useBooking();

  return (
    <button type="button" onClick={openBooking} className={className} {...rest}>
      {children}
    </button>
  );
}
