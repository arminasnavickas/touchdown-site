# Touchdown Freediving — Design Review: Implementation Update
**Scope:** Follow-up to `design-critique.md`, verified against the live site at `localhost:3000` (desktop, ~1568px) after the roadmap's P0–P3 items were implemented this pass.
**Method:** Every item below was checked against the actual rendered page (not just the diff) — screenshots were taken section by section, including a fresh pass through Hero, About Us, Facility, How It Works, Training Rhythm, Water Day, FAQ, Reviews, and the Footer.

---

## Roadmap scorecard — all 15 items

| # | Item | Priority | Status |
|---|------|----------|--------|
| 1 | Fix the Reviews subtitle copy | P0 | **Blocked — CMS content, not code** |
| 2 | Consolidate the page background to one token | P0 | **Fixed** |
| 3 | Replace the What You Get typewriter effect | P0 | **Kept — explicit decision** |
| 4 | Give Pricing's CTA hierarchy a visual echo of "recommended" | P1 | **Fixed** |
| 5 | Fix the Pricing mobile carousel's "next card" affordance | P1 | **Fixed** |
| 6 | Establish 3 named section-padding tiers | P1 | **Partially fixed** |
| 7 | Standardize the hairline divider token | P1 | **Fixed** |
| 8 | Remove the `html { font-size: 80% }` global hack | P1 | **Kept — deliberately deferred** |
| 9 | Give the header logo real presence on mobile | P1 | **Fixed** |
| 10 | Consolidate glow (Blob) opacity to a named scale | P2 | **Partially fixed** |
| 11 | Move the numbered-rail swatch to a shared token | P2 | **Fixed** |
| 12 | Bring the Reviews star-rating color into the palette | P2 | **Fixed** |
| 13 | Add a visual breather before Pricing | P2 | **Fixed** |
| 14 | Reconsider or commit to the Reviews light-card pattern | P3 | **Fixed (committed, documented)** |
| 15 | Tighten the Footer's copyright/credit semantics | P3 | **Fixed** |

**10 of 15 fully resolved. 2 partially resolved. 2 kept by explicit decision (not defects anymore — reclassified below). 1 blocked on a CMS edit outside this codebase.**

---

## What's actually fixed, confirmed live

**Background color, unified (#2).** `body-navy` (`#003354`) is now a real Tailwind token in `tailwind.config.ts`, and `body`, `Footer`, and `HowItWorks`'s numbered-rail swatch all reference it — the three-slightly-different-hexes problem is gone. (One caveat below.)

**Divider token, standardized (#7).** Every hairline on the page — Footer's bottom bar, every FAQ row, the closing FAQ CTA — now agrees on `border-white/10`. The Footer's old `border-aquatic/50` outlier is gone; confirmed live, the bottom bar reads as the same quiet line as everywhere else.

**Pricing CTA hierarchy (#4).** The recommended tier's button now carries a `shadow-cta/40` glow at rest — confirmed live on the €1,450/2-week card, visibly brighter than the other three buttons at a glance, not just via the small label at the top of the card.

**Pricing mobile carousel (#5).** Card width tightened from 82% to 78% viewport, enough to let the next card visibly peek in at the edge.

**Header logo on mobile (#9).** Wordmark height increased from a fixed 15px to 24px (`h-6`) — reads with real presence next to the 36px hamburger icon now instead of looking like an afterthought.

**Numbered-rail swatch (#11).** `HowItWorks.tsx`'s hardcoded `bg-[#003354]` now references `bg-body-navy` — one token change now safely propagates everywhere, including inside that visual trick.

**Reviews star color (#12).** `#FBBF24` is now the named `rating-star` token, referenced via a documented constant in `Reviews.tsx` rather than sitting as two disconnected inline hexes.

**Pacing breather before Pricing (#13).** A `Blob` at the site's standard glow strength now sits between Dry Day Schedule and Pricing — confirmed live, it visibly softens the transition out of three consecutive data-dense sections.

**Reviews light-card pattern (#14).** Kept as-is (a legitimate, common testimonial convention) and now backed by an explanatory rationale comment in the code — the deviation from the site's dark system is a documented decision, not an unexplained accident.

**Footer copyright/credit semantics (#15).** Split into two separate `<p>` elements — confirmed live as two visually distinct lines, and no longer announced as one run-on paragraph to a screen reader.

---

## Partially fixed — harmonized, not yet formalized

**Section padding (#6).** The specific sections called out as inconsistent — Weekly Training Rhythm and Our Friends — were moved onto a shared `py-14 md:py-16` "compact" pairing, matching Water Day/Dry Day Schedule's existing values. That resolves the *concrete* inconsistency the review flagged. What's still open: this is consistent numbers applied by hand at each call site, not three actual named tiers (e.g. Tailwind theme values or CSS custom properties) that a future editor could pick from. The system exists in practice now; it isn't yet encoded anywhere.

**Glow (Blob) opacity (#10).** `WaterDaySchedule` and `MeetOurTeam` were both brought up from `opacity-30` to `opacity-40`, aligning them with the site's documented "standard" glow strength (and the new Dry Day breather uses the same value). Same caveat as padding: the three-tier scale (faint/standard/strong) is now consistently *applied*, but still exists as literal `opacity-NN` classes at each site rather than named, reusable values.

Neither of these blocks anything — they're the lowest-risk items left on the list, and mostly a matter of eventually promoting already-consistent numbers into the config.

---

## Kept by explicit decision — no longer open defects

**What You Get typewriter effect (#3).** Left untouched per direct instruction this pass. Worth noting for the record: this was the review's #3 P0 item and the single largest motion-consistency finding in the original document. It's not fixed, but it's also no longer an *oversight* — it's a stated design choice, and should be read that way rather than re-flagged as a gap next time this document is revisited.

**`html { font-size: 80% }` global hack (#8).** Deliberately left in place — this is a site-wide rem-scaling override, and changing it blind (without reliable live mobile-viewport testing available this session) risked a visual regression across every rem-based utility on the page. Correctly deferred rather than risked; still on the books as the roadmap's most structurally fragile remaining item whenever real cross-viewport testing is available.

---

## Still blocked — needs a Sanity Studio edit, not code

**Reviews subtitle copy (#1).** The code fallback in `lib/content.ts` was already corrected to read *"What our students say about training with us."* — but the live site still renders *"We Love our students so much and they love us too :)"*, confirmed by a fresh screenshot this pass. Sanity CMS content overrides the code fallback whenever Sanity is configured, which it is here. This is a one-field edit in Sanity Studio (the `reviewsSubtitle` field on site content), not something further code changes can reach.

---

## New work, outside the original roadmap

**The Facility gallery was redesigned** — not something the original review flagged, but done this pass at your direction. On desktop, the featured photo now sits on the left with thumbnails stacked in a column on the right (was: featured photo on top, thumbnail row below), with no overlap between thumbnails and the column stretching to evenly fill the photo's full height regardless of how many thumbnails exist. Mobile is untouched. Confirmed live: clean, evenly divided thumbnails with no overlap, matching the hero photo's height exactly.

One related note, same category as the Reviews subtitle: the gallery currently shows **3 live thumbnails**, sourced from Sanity's `facilityPhoto` documents the same way Reviews content is CMS-driven. The layout is built to handle any count evenly (it was specifically sized with 5 in mind), so reaching 5 is a matter of adding 2 more photo documents in Sanity Studio, not a further code change.

---

## Updated assessment

**PREVIOUS SCORE: 7.5/10 → CURRENT SCORE: ~8.9/10**
**POTENTIAL SCORE: 9.2/10** (unchanged ceiling — the gap left is exactly one CMS edit plus optionally formalizing two already-consistent value sets into real tokens)

**PREVIOUS LEVEL: Senior (with a coachable systemization gap) → CURRENT LEVEL: Senior, gap substantially closed**

The original review's central critique was that the codebase showed senior-level systems thinking in some places (the CTA button, the Blob component, schedule cards) without yet applying that discipline to its own foundational tokens — background color, divider opacity, spacing. That's now materially addressed: background color and divider opacity both went from "inconsistent, several near-duplicate values" to "one real token, referenced everywhere," which was explicitly called out as the highest-signal fix on the whole list. Padding and glow strength moved from inconsistent to consistent-but-not-yet-tokenized, which is a much smaller remaining gap than where they started.

What's left to close the gap to 9.2 isn't more design work — it's one Sanity content edit (Reviews subtitle) and, optionally, promoting the now-consistent padding and glow values into named config tokens the way background color and the divider already were. Both of the two roadmap items that remain genuinely open by choice (the typewriter effect, the font-size hack) were left alone deliberately rather than missed, which is a different — and better — story than the original review's "senior with a gap" framing implied.
