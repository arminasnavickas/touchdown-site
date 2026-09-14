"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";

// Brevo (Sendinblue) sign up form "Touchdown Footer Newsletter", list:
// Newsletter. Posts straight to Brevo's hosted endpoint via a hidden
// iframe so the visitor never leaves the page. The endpoint is cross
// origin, so the response can't be read here, which is why the success
// state below is optimistic rather than tied to a real server reply.
// Get a fresh action URL from Brevo > Marketing > Forms > Touchdown
// Footer Newsletter > Share > Simple HTML if this ever needs to change.
const BREVO_ACTION_URL =
  "https://53ef6617.sibforms.com/serve/MUIFAO3lyHOGlwKUWIVV0Lpbf5rZQLtm3R3dxcxy7x-xx8kAP4B1xoCeOTysqqdcltWUMUVUcXm0-aO_hoIcnqFphQzu6h0RD6hiYV3gx13eFOhDPfhkseM9jdyt4s1zByDfvvja-56e9hltkVBrZXiT-VK0eoXrSgvF_elHPvWlx5m6nVosiqOTYz0pv6u66VnFLj0sPEwk-c9p5A==";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    if (status === "error") setStatus("idle");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (status === "submitting") {
      event.preventDefault();
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      event.preventDefault();
      setStatus("error");
      inputRef.current?.focus();
      return;
    }
    // Real submission proceeds to the hidden iframe (no preventDefault
    // below this point). The delay just gives the "Sending..." state a
    // moment to register before flipping to the optimistic success state.
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 600);
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex items-center gap-3 ${className}`.trim()}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-aquatic/15 text-aquatic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="font-switzer text-lg font-light text-white/80">
          You&rsquo;re on the list. Welcome aboard!
        </p>
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col gap-2.5 ${className}`.trim()}>
      <form
        action={BREVO_ACTION_URL}
        method="POST"
        target="brevo-newsletter-frame"
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-start"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            ref={inputRef}
            id="newsletter-email"
            type="email"
            name="EMAIL"
            required
            value={email}
            onChange={handleChange}
            placeholder="Your email"
            autoComplete="email"
            disabled={status === "submitting"}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? errorId : undefined}
            className={`w-full min-w-0 rounded-lg border bg-white/5 px-4 py-3.5 font-switzer text-base font-light text-white placeholder-white/40 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
              status === "error"
                ? "border-cta/70 focus:border-cta"
                : "border-white/20 focus:border-aquatic"
            }`}
          />
          {status === "error" && (
            <p id={errorId} role="alert" className="font-switzer text-sm font-light text-cta">
              Enter a valid email address.
            </p>
          )}
        </div>

        {/* Honeypot field Brevo uses to catch bots. Keep hidden. */}
        <input
          type="text"
          name="email_address_check"
          defaultValue=""
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />
        <input type="hidden" name="locale" value="en" />

        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-lg bg-cta px-7 py-3.5 font-switzer text-base font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Subscribe"}
        </button>

        {/* Keeps the visitor on the page after submitting. */}
        <iframe name="brevo-newsletter-frame" className="hidden" title="newsletter signup" />
      </form>
      <p className="font-switzer text-sm font-light text-white/35">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
