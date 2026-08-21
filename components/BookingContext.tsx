"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { PricingTier } from "@/lib/content";

type BookingContextValue = {
  openBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckSealIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-16">
      <path
        d="M12 1.5 14.4 3l2.8-.6 1.4 2.5 2.5 1.4-.6 2.8L22 12l-1.5 2.4.6 2.8-2.5 1.4-1.4 2.5-2.8-.6L12 22.5 9.6 21l-2.8.6-1.4-2.5-2.5-1.4.6-2.8L2 12l1.5-2.4-.6-2.8 2.5-1.4L6.8 2.4l2.8.6L12 1.5Z"
        fill="#22C55E"
      />
      <path d="M8 12.5 10.8 15 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlanDropdown({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name="plan" value={value} required />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-[6px] border border-dark-ocean-blue/20 px-4 py-3 font-switzer text-lg text-dark-ocean-blue transition focus:border-cta focus:outline-none md:text-base"
      >
        <span className={value ? "" : "text-dark-ocean-blue/40"}>
          {value || "Select a plan"}
        </span>
        <ChevronIcon className={`size-4 shrink-0 text-dark-ocean-blue/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-60 overflow-y-auto rounded-[6px] border border-dark-ocean-blue/20 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left font-switzer text-lg transition hover:bg-cta/10 md:text-base ${
                option === value ? "bg-cta/15 text-dark-ocean-blue" : "text-dark-ocean-blue/80"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const REG_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdilCxLdxfrd3GeNY7q03X27myLy8YogvcBZq0iD_HvzMzk1w/viewform";

export default function BookingProvider({
  children,
  tiers,
}: {
  children: React.ReactNode;
  tiers: PricingTier[];
}) {
  const planOptions = tiers.map((tier) => `${tier.name} \u2014 ${tier.duration} \u2014 ${tier.price}`);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [countdown, setCountdown] = useState(3);

  const openBooking = () => {
    setSubmitted(false);
    setSelectedPlan("");
    setOpen(true);
  };
  const close = () => setOpen(false);
  const goToRegForm = () => {
    window.open(REG_FORM_URL, "_blank", "noopener,noreferrer");
    close();
  };
  const goBack = () => setSubmitted(false);

  // Lock background scroll while open; restore on close. `overflow:
  // hidden` alone doesn't prevent touch-scrolling on iOS Safari, so we pin
  // the body at its current scroll position instead and restore it on close.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const html = document.documentElement;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.overflow = "hidden";
    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.overflow = "";
      // globals.css sets `scroll-behavior: smooth` on <html>, which
      // otherwise makes this restore visibly animate instead of snapping
      // back instantly. Force it off just for this jump.
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [open]);

  // Close on Escape - standard expected behavior for any modal/dialog.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!submitted) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          goToRegForm();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-ocean-blue/50 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 h-0 overflow-visible">
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-5 top-5 rounded-full bg-white/80 p-2.5 text-dark-ocean-blue backdrop-blur-sm transition hover:text-cta"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 bg-dark-ocean-blue px-8 py-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-white.svg" alt="Touchdown" className="h-6 w-auto" />
            </div>

            <div className="px-8 py-8 md:px-10">
              <h2 className="mb-6 text-center font-switzer text-3xl font-light tracking-tight text-dark-ocean-blue">
                Book your training
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center gap-6 py-4 text-center">
                  <CheckSealIcon />
                  <p className="font-switzer text-xl font-semibold uppercase tracking-wide text-dark-ocean-blue">
                    Well done! Now fill up the reg.form
                  </p>
                  <p className="font-switzer text-base font-light text-dark-ocean-blue/70">
                    Next, complete our registration form so we have everything we
                    need before your first session.
                  </p>
                  <button
                    type="button"
                    onClick={goToRegForm}
                    className="w-full rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition hover:bg-aquatic hover:text-dark-ocean-blue"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="w-full rounded-[6px] border border-dark-ocean-blue/20 px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-dark-ocean-blue transition hover:border-cta hover:text-cta"
                  >
                    Back
                  </button>
                  <p className="font-switzer text-sm text-dark-ocean-blue/50">
                    You&rsquo;ll be automatically redirected in: ({countdown})
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Name"
                    className="rounded-[6px] border border-dark-ocean-blue/20 px-4 py-3 font-switzer text-lg text-dark-ocean-blue placeholder:text-dark-ocean-blue/40 focus:border-cta focus:outline-none md:text-base"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="font-switzer text-base text-dark-ocean-blue/70 md:text-sm">
                      Preferred start date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="rounded-[6px] border border-dark-ocean-blue/20 px-4 py-3 font-switzer text-lg text-dark-ocean-blue placeholder:text-dark-ocean-blue/40 focus:border-cta focus:outline-none md:text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-switzer text-base text-dark-ocean-blue/70 md:text-sm">
                      Choose your plan
                    </label>
                    <PlanDropdown options={planOptions} value={selectedPlan} onChange={setSelectedPlan} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-switzer text-base text-dark-ocean-blue/70 md:text-sm">
                      Telegram number
                    </label>
                    <input
                      type="tel"
                      name="telegram"
                      required
                      placeholder="+44 00-0000-00000"
                      className="rounded-[6px] border border-dark-ocean-blue/20 px-4 py-3 font-switzer text-lg text-dark-ocean-blue placeholder:text-dark-ocean-blue/40 focus:border-cta focus:outline-none md:text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-switzer text-base text-dark-ocean-blue/70 md:text-sm">
                      Your e-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="example@mail.com"
                      className="rounded-[6px] border border-dark-ocean-blue/20 px-4 py-3 font-switzer text-lg text-dark-ocean-blue placeholder:text-dark-ocean-blue/40 focus:border-cta focus:outline-none md:text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-[6px] bg-cta px-8 py-4 font-switzer text-base font-medium uppercase tracking-wide text-white transition hover:bg-aquatic hover:text-dark-ocean-blue"
                  >
                    Submit
                  </button>
                </form>
              )}

              <p className="mt-6 text-center font-switzer text-base text-dark-ocean-blue/70">
                Your dream is our goal!
              </p>
            </div>
          </div>
        </div>
      )}
    </BookingContext.Provider>
  );
}
