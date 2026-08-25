"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SearchIcon, CloseIcon } from "./BlogIcons";
import type { BlogPost } from "@/lib/content";

// A subtle trigger ("SEARCH ARTICLES") rather than a search bar permanently
// occupying the header - it opens a light, understated overlay instead of a
// heavy modal. Filtering happens entirely client-side against the post list
// already fetched server-side for the index page, so there's no extra
// network round-trip and no separate search endpoint to maintain.
export default function BlogSearch({ posts }: { posts: BlogPost[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Reset the query each time the overlay closes, so re-opening it always
  // starts from a clean state rather than showing a stale search.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts
      .filter((post) =>
        [post.title, post.excerpt, post.category ?? ""].some((field) =>
          field.toLowerCase().includes(q)
        )
      )
      .slice(0, 8);
  }, [posts, query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex shrink-0 items-center gap-2 font-switzer text-xs font-medium uppercase tracking-[0.2em] text-dark-ocean-blue/45 transition hover:text-cta md:text-sm"
      >
        <SearchIcon className="size-4 transition group-hover:text-cta" />
        <span className="hidden sm:inline">Search articles</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-6 pt-24 md:pt-32">
          <div
            aria-hidden
            className="absolute inset-0 bg-dark-ocean-blue/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center gap-3 border-b border-dark-ocean-blue/10 px-5 py-4">
              <SearchIcon className="size-5 shrink-0 text-dark-ocean-blue/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full bg-transparent font-switzer text-lg font-light text-dark-ocean-blue placeholder:text-dark-ocean-blue/35 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="shrink-0 text-dark-ocean-blue/40 transition hover:text-cta"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {query.trim() && (
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-5 py-8 text-center font-switzer text-base font-light text-dark-ocean-blue/50">
                    No articles match &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  <ul className="flex flex-col divide-y divide-dark-ocean-blue/10">
                    {results.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/blog/${post.slug}`}
                          onClick={() => setOpen(false)}
                          className="group flex flex-col gap-1 px-5 py-4 transition hover:bg-dark-ocean-blue/[0.03]"
                        >
                          {post.category && (
                            <span className="font-switzer text-[11px] font-semibold uppercase tracking-[0.2em] text-cta">
                              {post.category}
                            </span>
                          )}
                          <span className="font-switzer text-base font-light text-dark-ocean-blue transition group-hover:text-cta">
                            {post.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
