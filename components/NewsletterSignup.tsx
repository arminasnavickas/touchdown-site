"use client";

import { useState } from "react";

// Brevo (Sendinblue) sign up form "Touchdown Footer Newsletter", list:
// Newsletter. Posts straight to Brevo's hosted endpoint via a hidden
// iframe so the visitor never leaves the page - the endpoint is cross
// origin, so the response can't be read here, which is why the success
// message below is optimistic rather than tied to a real server reply.
// Get a fresh action URL from Brevo > Marketing > Forms > Touchdown
// Footer Newsletter > Share > Simple HTML if this ever needs to change.
const BREVO_ACTION_URL =
  "https://53ef6617.sibforms.com/serve/MUIFAO3lyHOGlwKUWIVV0Lpbf5rZQLtm3R3dxcxy7x-xx8kAP4B1xoCeOTysqqdcltWUMUVUcXm0-aO_hoIcnqFphQzu6h0RD6hiYV3gx13eFOhDPfhkseM9jdyt4s1zByDfvvja-56e9hltkVBrZXiT-VK0eoXrSgvF_elHPvWlx5m6nVosiqOTYz0pv6u66VnFLj0sPEwk-c9p5A==";

export default function NewsletterSignup({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit() {
    setTimeout(() => setStatus("sent"), 500);
  }

  if (status === "sent") {
    return (
      <p className={`font-switzer text-base font-light text-white/50 ${className}`.trim()}>
        Thanks for subscribing!
      </p>
    );
  }

  return (
    <form
      action={BREVO_ACTION_URL}
      method="POST"
      target="brevo-newsletter-frame"
      onSubmit={handleSubmit}
      className={`flex w-full max-w-sm items-center gap-2 ${className}`.trim()}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="EMAIL"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email"
        className="w-full rounded-[6px] border border-white/20 bg-white/5 px-3 py-2.5 font-switzer text-sm font-light text-white placeholder-white/40 transition focus:border-aquatic focus:outline-none"
      />

      {/* Honeypot field Brevo uses to catch bots - keep hidden */}
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
        className="shrink-0 rounded-[6px] bg-cta px-4 py-2.5 font-switzer text-sm font-medium uppercase tracking-wide text-white transition-all duration-200 ease-out hover:bg-aquatic hover:text-dark-ocean-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
      >
        Subscribe
      </button>

      {/* Keeps the visitor on the page after submitting */}
      <iframe name="brevo-newsletter-frame" className="hidden" title="newsletter signup" />
    </form>
  );
}
