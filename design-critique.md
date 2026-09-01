# Touchdown Freediving — Senior Design Review
**Reviewer stance:** Design director / senior UX lead / hiring manager
**Scope:** `localhost:3000` — full page, section by section
**Constraint honored:** No changes made. No redesign proposed. Existing visual identity (deep ocean navy, cyan accent, underwater photography, restrained borders, editorial type) is treated as the correct foundation throughout.

**Methodology note:** This review is based on (1) direct visual inspection of the rendered desktop site (~1568px), including click-testing interactive components, and (2) full source review of every component and its Tailwind classes, including the extensive inline design-rationale comments already in the codebase. The live browser tooling in this session could not reliably render true mobile viewport widths (a known limitation, not a site defect), so mobile-specific findings below are sourced from the `md:`/`lg:` responsive logic in code rather than a live screenshot, and are labeled accordingly. That distinction is called out wherever it matters.

Two items on your section list don't exist as named sections in the build — mapped as follows: **"What We Teach"** is covered under *How It Works* + *What You Get* (the two sections that actually carry curriculum/outcome content). **"City Schedule"** is covered under *Weekly Training Rhythm* + *Water Day / Dry Day Schedule* (the three sections that make up the actual programme calendar).

---

## Section-by-section

### 1. Header / Navigation
**Strong.** Scroll-spy highlighting, an `id`-decoupled href map (a CMS label rename can never break a link), and real iOS Safari bug fixes in the mobile menu (position-fixed scroll lock, `scroll-behavior` override so the close-animation doesn't visibly re-scroll) — this is the kind of cross-browser rigor most portfolios never demonstrate.

- The wordmark renders at a fixed **15px tall on mobile**. That's genuinely small for a logo that has to carry brand presence at the very top of the page — it reads as an afterthought next to the hamburger icon's `size-9` (36px).
- Four items compete for the same visual weight in the desktop utility row: three contact icons (email/Telegram/WhatsApp) sit directly beside the one primary conversion button, all roughly equal in visual pull. There's no hierarchy telling the eye "this one matters most" beyond the button's fill color.

### 2. Hero
**One of the three strongest sections on the site**, and it earns that: a calibrated directional gradient keyed to where the copy sits (not a flat scrim), a deliberate two-line mobile headline break instead of leaving the browser to wrap wherever it wants, parallax on a throttled rAF loop (not causing React re-renders), and autoplay that respects `prefers-reduced-motion`.

- The subcopy column jumps from `max-w-[280px]` on mobile to `max-w-xl` on desktop — 280px is a very narrow forced column, likely producing choppy 3–4-word line lengths on a phone.
- The section is dense with hand-placed pixel values (`pb-[95px]`, `translate-y-[35px]`, `bottom-[180px]`, `bottom-[116px]`, etc.), each individually justified in comments but collectively a sign the layout is held together by careful one-off tuning rather than a small set of reusable offsets. Works today; brittle the next time hero content changes shape.

### 3. Image Gallery
Clean, confident, and correctly treated as untouchable — the "LOCKED LAYOUT" comment protecting the Hero-overlap collage effect from casual dilution is exactly the kind of guardrail a senior engineer leaves for future editors. Zero-gap uniform grid, real alt text, restrained hover state.

- The one open question: this is a wordless, headingless wall of 8 photos between Hero and About Us. Intentional per the code comments, and defensible as a breather — but it's worth being a deliberate choice you can articulate ("this is a mood-setting interlude, not a section") rather than an absence nobody decided on.

### 4. About Us
Solid. Order-based mobile reordering (text above photo without duplicating markup), a single dominant photo instead of a gallery, restrained copy split into real paragraphs.

- Low-severity: paragraphs are auto-split from free CMS text using a regex heuristic keyed on `. "` boundaries — fragile if a future editor writes something like "Mr. Smith says…", but invisible today with the current copy.

### 5. How It Works
**The other of the three strongest sections.** The numbered rail threading all four steps into one line, escalating photo heights and type sizes across the sequence (a literal typographic "growing" rhythm), and a genuine mobile timeline (not a squashed grid) show real conceptual thinking, not just visual decoration.

- The step number sits on a hardcoded `bg-[#003354]` swatch to mask the rail line passing behind each digit. That hex is a hand-picked duplicate of the page's actual background color (defined separately in `globals.css`) rather than a shared value — works now, will silently break the moment the background ever changes.
- Truncated copy (`line-clamp-3`) opens a full modal for what's often one extra sentence — worth asking whether a full `ArticleModal` is proportionate friction for that little extra content.

### 6. What You Get
Clean two-column definition-list layout, correctly demoted to a "light supporting beat" (smaller padding, tighter gaps) rather than matching the big showcase sections around it.

- **The one real motion-consistency problem on the whole site**: item titles ("Relaxation," etc.) are typed out letter-by-letter via a custom `TypewriterText` component — the *only* place on the entire page using this effect; everywhere else uses one consistent fade/slide-up. It also **resets and replays every single time the item scrolls back into view** — scroll up and back down past this section and the titles blank out and retype again. Confirmed live: scrolling to this section mid-animation shows a fully blank title next to fully-rendered body copy for close to a second. This is the single most "trying too hard" detail on an otherwise very restrained page.

### 7. Weekly Training Rhythm
Good editorial table treatment — the redundant WATER/DRY chip strip was already removed (this session's earlier work), day-abbreviation and type now read as one timeline pairing, multi-session times split cleanly instead of overflowing on narrow phones.

- Minor semantic softness: DRY renders in full-strength white — the same color weight as this section's own H2 — while WATER (the section's actual differentiator, and the product's core offering) is only distinguished by a shift to cyan. Not wrong, just worth being sure it's the intended emphasis.

### 8. Water Day / Dry Day Schedule
Genuinely well differentiated from each other (a featured full-width lead card + 3-grid vs. a two-panel divide-x split) — this is the kind of layout differentiation that keeps back-to-back sections from feeling interchangeable, and it's already done.

- Content-pacing concern: Training Rhythm → Water Day → Dry Day is **three consecutive data/table-dense sections** between two photography-led moments (Facility above, Pricing's cards below). Individually each is well executed; back to back, that's a long stretch without a visual breather.

### 9. Pricing
**The third of the three strongest sections**, per both the code's own confidence and my read of it: editorial thin-rule cards instead of SaaS boxes, identical box geometry across all four tiers so the "popular" tint never misaligns anything, a real `h-full` stretch grid, and a mobile snap-carousel replacing a long vertical stack.
*(Caveat: I wasn't able to get a clean, unglitched live screenshot of this section this session — assessment below leans on code more than the others.)*

- All four tiers render the **identical CTA copy** ("Book your dive"), differentiated only by an `aria-label` invisible to sighted users. Scanning the row, all four buttons look identical; the only "this one's recommended" signal is a small label at the very top of the card, easy to miss if a visitor's eye goes straight to price → CTA.
- The mobile carousel cards are sized at 82% viewport width with **no visible sliver of the next card peeking in** — the code's own comment admits this ("no visible edge... peeking in") and compensates with an instructional "Swipe to compare →" text label. Needing words to explain an affordance is usually the tell that the affordance itself is incomplete; the standard fix is sizing the card so the next one visibly peeks in, making the label optional rather than load-bearing.

### 10. Team
**Confirmed live — this is excellent.** Eight uniform black-and-white studio portraits, consistent crossed-arms pose, real `aspect-[4/5]` portrait crop (not a cropped landscape), and `mt-auto` keeps every card's action row pinned to the same baseline regardless of bio length. This section alone would not look out of place on a much larger brand's site.

- No real complaint here. The only thing worth a live tablet-width check (not verifiable this session) is the `sm:grid-cols-2` intermediate step before `lg:grid-cols-4` — a decent range of tablet widths shows a 2-up grid, which is fine but changes the row-height-parity math from "4 cards level" to "2 cards level."

### 11. Reviews
Smart card ordering (reviewer identity before the quote, not after), a snap-scroll carousel with real pointer-drag support, and a "Read more" that only appears when the clamped text *actually* overflows (measured via `scrollHeight`, not just assumed) — a genuinely clever, non-obvious detail.

- **Copy-tone break, confirmed live**: the section subtitle reads *"We Love our students so much and they love us too :)"* — inconsistent mid-sentence capitalization, a stray emoticon, and a casual register that lands directly under a big "Reviews" H2, right after the much more polished "The proof is in the pudding" eyebrow. Every other section on the site (Pricing, How It Works, FAQ) is written in a tight, editorial voice; this is the one place that voice visibly slips, at one of the highest-trust moments on a services site.
- Review cards are the **only light/white-background component anywhere on the page** — every other card (pricing, schedule, facility, team) stays dark-on-navy. Testimonial cards going bright/white-paper is a legitimate, common convention (reads as "real, camera-roll" testimonials), but it's a genuine rhythm break worth being able to defend as a deliberate choice.
- The star-rating color (`#FBBF24`, an amber) is a hardcoded hex that doesn't exist anywhere in the Tailwind color palette (`dark-ocean-blue`, `horizon`, `aquatic`, `navy`, `danish-blue`, `cta`) — the only off-brand-palette color used anywhere on the site.

### 12. FAQ
**Confirmed live — no real notes.** Single defined content column (was previously two mismatched widths), clean category grouping, generous row padding that reads as a real editorial line rather than a cramped accordion, and a local closing CTA that correctly compensates for the floating "Book" pill fading out in this zone. This section is done.

### 13. Final CTA / Footer
**Confirmed live.** "Ready to Dive In?" is sized and weighted as a genuine closing statement, not another footer row. Real 2-column grid at every breakpoint (not stacked-then-row), the logo/social block mirrors the CTA's left alignment on the right edge, and the third of exactly three glow moments on the page closes the composition the way the first (Hero) opened it.

- One concrete, provable inconsistency: **the page background color is defined three slightly different ways** across the codebase — `#003354` (the actual `<body>` background in `globals.css`), `#003252` (the Footer's own inline `backgroundColor`), and `#023048` (the `dark-ocean-blue` design token, used for headlines/buttons — a legitimately *different* semantic color, not a duplicate). The first two are meant to be "the same navy" but are off by 1–2 units per channel — imperceptible to the eye today, but proof the canonical background color isn't defined once and reused; it's been re-picked by eye at least twice.
- The Legal-links/back-to-top divider (`border-aquatic/50`) is a noticeably brighter, saturated line compared to the quiet `border-white/10`–`/15` hairlines used as dividers everywhere else on the page (Pricing, FAQ, What You Get, Training Rhythm all agree on white-at-low-opacity as "the divider color"). This is the one divider on the page that breaks that established convention.

---

## Cross-cutting findings (the "almost right" details)

These span multiple sections and are, frankly, the highest-leverage findings in this review — they're the pattern of small inconsistencies that separates "very good" from "senior systemized":

1. **Section vertical padding has no clean tier system.** Counting actual top-padding values in use: `py-14`, `py-16`, `py-20`, `py-24`, `py-28`, plus Pricing's deliberately asymmetric `pt-24/pb-32`. Each is individually reasoned in comments ("compact vs. showcase"), but that's ~7 distinct numbers doing the job 3 named tiers (compact / standard / showcase) could do more legibly and more resistant to drift.
2. **Divider-line opacity isn't standardized**: `border-white/10` and `border-white/15` are used near-interchangeably for what's conceptually one design token ("quiet hairline divider"). The Footer's `border-aquatic/50` breaks the pattern entirely (see above).
3. **Glow opacity is a similar long tail**: `opacity-40`, `opacity-30`, `opacity-80` (plus Hero's own separately-coded blob at its own strength) — again, individually justified, collectively unsystematized.
4. **Three near-identical navy hex values** for what should be one canonical "page background" (see Footer finding above) — the most concrete, provable instance of the same underlying pattern.
5. **The global `html { font-size: 80% }` override** shrinks every rem-based Tailwind utility site-wide by 20% in one line, rather than authoring at the intended scale. It renders correctly today, but it's a fragile, easy-to-forget mechanism: any future component built by someone unaware of this line will render 20% smaller than every reference/example they're copying from, and it complicates anything that reasons about real browser zoom or rem-based accessibility settings.
6. **The typewriter effect in What You Get is the single biggest motion outlier** — see Section 6 above. Everything else on the page commits to one restrained fade/slide-up language; this is the one place that language is broken.

---

## Hiring-manager verdict

**Strongly shortlist, leaning senior — with one clear gap to probe in an interview.**

This is not a portfolio I'd reject, and it's not a borderline "maybe interview." The evidence of senior-level *systems thinking* is too consistent and too deliberate to be luck: a single source-of-truth CTA button component that every call site is structurally prevented from silently drifting away from; a documented, protected "LOCKED LAYOUT" guard against casual visual dilution; a `data-fab-avoid` collision-detection system for a floating CTA that most candidates wouldn't even think to build; real, tested iOS Safari-specific bug fixes with the actual bug mechanism explained in the comment, not just patched blind; and content-architecture decisions (differentiating Water Day from Dry Day, escalating How It Works' photo/type scale to narrate progression) that show design *reasoning*, not just visual taste.

What keeps this at "strongly shortlist" rather than an unqualified "senior, hire" is that the same codebase that shows this level of systems discipline in some places (the CTA button, the Blob component, the schedule cards) has *not yet* applied that discipline to its own foundational tokens — spacing scale, divider opacity, background color, glow strength. That's a specific, coachable gap, not a taste problem: the person clearly *can* build a system (they've proven it three or four times over on this exact site) — they haven't yet gone back and unified the tokens the system itself is built from. That's exactly the kind of gap a design director would want to talk through directly rather than infer a verdict from: "walk me through why the page background is defined in three places" is a fair, generative interview question here, not a gotcha.

---

## Senior-level signals already present

- Single source-of-truth CTA button (`BookInButton`) — every call site can only append layout classes, never override the base style, which structurally prevents four different "Book" buttons from drifting apart over time.
- A documented, intentional "LOCKED LAYOUT" guard on Gallery, explicitly warning future editors against reintroducing complexity without a real reason.
- `data-fab-avoid`: a live collision-detection system so the floating CTA/back-to-top stack never covers page content in the corner it occupies — most builds simply accept that bug.
- Real, explained cross-browser fixes: iOS Safari's `backdrop-filter` repaint bug on `position: sticky`, the `position: fixed` body-scroll-lock technique (not just `overflow: hidden`, which doesn't work on iOS), and a `scroll-behavior` override so a programmatic scroll-restore doesn't visibly animate.
- Real content-architecture decisions, not just visual reskins: Water Day vs. Dry Day genuinely differentiated by information shape (4 events vs. 2), not by color; How It Works escalates photo height and type size across its 4 steps to narrate progression before a word of copy is read.
- Photography direction that goes beyond "pick a nice photo": Hero's overlay gradient is directionally calibrated to where the copy sits, not a flat scrim; Team's eight portraits are genuinely uniform (same pose, same crop, same lighting) rather than assembled from whatever photos existed.
- Accessibility beyond the minimum: `aria-pressed`/`aria-selected` on interactive controls, `focus-visible` rings on the primary CTA, `prefers-reduced-motion` respected in the Hero's autoplay, and a "Read more" on reviews that only renders when text is *actually* clamped (measured, not assumed).
- Real responsive redesigns, not naive breakpoint shrinking: Footer is a genuine 2-column grid at every width (not stacked-then-row), How It Works becomes a true vertical timeline on mobile (not a squashed grid), Pricing switches to a snap-carousel rather than a long stack.

## Current weaknesses preventing Senior+

Specific, not generic:

1. **No unified spacing scale** — 7 distinct section-padding values in use where 3 named tiers would do the same job more legibly (see Cross-cutting #1).
2. **No unified divider token** — `white/10` vs `white/15` used interchangeably, plus one outright break from the pattern (Footer's `aquatic/50` bottom-bar rule).
3. **The page's own background color is defined three slightly different ways** across the codebase, one of which is provably off by 1–2 hex units from the other (Footer finding) — the clearest single piece of evidence that foundational values aren't centralized yet.
4. **One unexplained motion-language break**: the What You Get typewriter effect is the only non-fade animation on the site, and it visibly replays/blanks on every re-entry into view.
5. **A structural global hack** (`html { font-size: 80% }`) standing in for deliberately-scaled type/spacing values — works, but is the kind of thing that reads as "made it fit" rather than "designed at this scale."
6. **Pricing's CTA hierarchy doesn't visually echo the recommended tier** — four identical buttons, with the "which one should I pick" signal living only in a small label most visitors will have already scrolled past by the time they reach the CTA.
7. **One clear copy-voice lapse** at a high-trust moment (Reviews subtitle) — the only place the site's otherwise-consistent editorial tone visibly slips.

---

## The 9+/10 roadmap — top 15, in priority order

**1. Fix the Reviews subtitle copy**
CURRENT: "We Love our students so much and they love us too :)" — inconsistent capitalization, stray emoticon, casual register.
PROBLEM: It's the one place the site's otherwise-tight editorial voice audibly drops, directly under a major trust-building H2.
CHANGE: Rewrite in the same voice as the rest of the page (e.g., something as plain as "What our students say about training with us" — already drafted once earlier in this project's history).
RESULT: The Reviews section reads with the same confidence as Pricing and How It Works instead of like unedited placeholder text.
PRIORITY: **P0**

**2. Consolidate the page background color to one value**
CURRENT: `#003354` (body), `#003252` (Footer inline), `#023048` (`dark-ocean-blue` token — different, legitimate role).
PROBLEM: Two of those three are meant to be identical "page navy" but are provably not — a silent inconsistency waiting to become a visible one.
CHANGE: Pick one canonical background hex, add it to `tailwind.config.ts` as a named token (e.g., `body-navy`), and reference it everywhere instead of retyping a literal.
RESULT: One real source of truth for the page's own background — invisible today, but removes a specific, provable defect from the codebase.
PRIORITY: **P0**

**3. Replace the What You Get typewriter effect**
CURRENT: Letter-by-letter typing animation on item titles, resetting and replaying on every scroll re-entry.
PROBLEM: The only motion-language outlier on the site; delays legibility of the shortest, most scannable text on the page; reads as a flourish rather than something earning its place.
CHANGE: Swap to the same `Reveal` fade/slide-up used by every other element on the page.
RESULT: One consistent, restrained motion language site-wide — nothing on the page calls attention to its own cleverness anymore.
PRIORITY: **P0**

**4. Give Pricing's CTA hierarchy a visual echo of "recommended"**
CURRENT: All four tiers render an identical filled cyan "Book your dive" button; the only differentiation is a small label at the top of the card.
PROBLEM: By the time a scanning eye reaches the CTA row at the bottom, the "which one's recommended" signal from the top of the card has often already been scrolled past.
CHANGE: Give the popular tier's button a distinct treatment (e.g., a subtle glow/scale-up already used elsewhere on hover, made a resting state for this one card) so the recommendation reads at the point of decision, not just at the point of arrival.
RESULT: A visitor scanning bottom-up (price → CTA, which is how people actually compare pricing tables) still gets the "start here" signal.
PRIORITY: **P1**

**5. Fix the Pricing mobile carousel's "next card" affordance**
CURRENT: Cards sized at 82% viewport width with no visible sliver of the next card; a "Swipe to compare →" text label compensates.
PROBLEM: Needing instructional copy to explain a swipe gesture is the tell that the affordance itself is incomplete.
CHANGE: Resize cards so ~6–10px of the next card is visibly peeking in at the edge.
RESULT: The gesture becomes self-evident; the text hint becomes a nice-to-have instead of the thing carrying the whole affordance.
PRIORITY: **P1**

**6. Establish 3 named section-padding tiers**
CURRENT: 7 distinct top-padding values in use (`py-14/16/20/24/28`, plus Pricing's asymmetric pair) across sections.
PROBLEM: Each is individually reasoned but collectively there's no legible system — a future editor has no way to know which of 7 numbers a new section "should" use.
CHANGE: Define `--space-compact`, `--space-standard`, `--space-showcase` (or the Tailwind equivalent) and map every section to one of exactly three values.
RESULT: The site's existing "compact schedule sections vs. showcase sections" instinct becomes a real, nameable system instead of an implicit pattern.
PRIORITY: **P1**

**7. Standardize the hairline divider token**
CURRENT: `border-white/10` and `border-white/15` used interchangeably; Footer's bottom bar breaks the pattern entirely with `border-aquatic/50`.
PROBLEM: One conceptual design decision ("quiet divider between content blocks") currently has three different implementations.
CHANGE: Pick one opacity (likely `/10`, the more common of the two) as the single divider treatment; bring the Footer's bottom-bar rule in line with it.
RESULT: Every rule/divider on the page reads as the same deliberate element, not several slightly-different ones.
PRIORITY: **P1**

**8. Remove the `html { font-size: 80% }` global hack**
CURRENT: A single root-level override shrinks every rem-based utility site-wide by 20%.
PROBLEM: Fragile and easy to forget — any future component authored with standard Tailwind values will silently render smaller than intended, and it complicates real browser-zoom/accessibility reasoning.
CHANGE: Author the type/spacing scale at its actual intended values directly (adjust the handful of `text-*` classes that need it) rather than compensating globally.
RESULT: What you see in Tailwind's docs matches what renders — no more mental 80% conversion tax when reading or writing the codebase.
PRIORITY: **P1**

**9. Give the header logo real presence on mobile**
CURRENT: Wordmark renders at a fixed 15px tall on mobile.
PROBLEM: Undersells the brand at the single most-seen moment on the page (every screen, every scroll position via the sticky header).
CHANGE: Increase to a size that reads with real confidence next to the 36px hamburger icon — even a modest bump changes the header's authority.
RESULT: The header stops feeling like an afterthought relative to the rest of the page's confident typography.
PRIORITY: **P1**

**10. Consolidate glow (Blob) opacity to a small named scale**
CURRENT: `opacity-30/40/80` plus Hero's independently-coded blob strength.
PROBLEM: Same underlying issue as the padding/divider findings — individually reasoned, collectively unsystematized.
CHANGE: Define 2–3 named glow strengths (faint / standard / strong) and map every instance to one.
RESULT: The "exactly three deliberate glow moments" concept the code already aspires to (Hero, Pricing, Footer) becomes reinforced by every glow using a value from the same small, intentional set.
PRIORITY: **P2**

**11. Move the numbered-rail background swatch to a shared token**
CURRENT: `bg-[#003354]` hardcoded in `HowItWorks.tsx` to mask the rail line behind each step number, duplicating (imperfectly — see #2) the page's actual background.
PROBLEM: Silently breaks the moment the page background is changed anywhere else without this literal being updated in lockstep.
CHANGE: Reference the same canonical background token from recommendation #2 here instead of a separately-typed hex.
RESULT: One change to the page background now safely propagates everywhere, including inside this specific visual trick.
PRIORITY: **P2**

**12. Bring the Reviews star-rating color into the palette**
CURRENT: Hardcoded `#FBBF24` amber, absent from `tailwind.config.ts`.
PROBLEM: The only off-brand-palette color anywhere on the site.
CHANGE: Either add it to the config as a named, intentional "rating-star" token, or replace it with an in-palette equivalent (e.g., `cta` or `aquatic`) if amber isn't actually a deliberate choice.
RESULT: Every color on the page can be traced to one deliberate palette — no more "where did this one color come from" questions.
PRIORITY: **P2**

**13. Add a visual breather between the three schedule sections and Pricing**
CURRENT: Training Rhythm → Water Day → Dry Day run consecutively, all data/table-dense, immediately before Pricing.
PROBLEM: Three text-heavy sections in a row is a long stretch without a photography or trust-signal beat, between two otherwise strong photo/showcase moments.
CHANGE: Even a light-touch addition (a wider glow, a pull-quote, a single strong photo strip) between Dry Day and Pricing would reset the pacing before the site's biggest conversion moment.
RESULT: The page's overall rhythm — showcase, data, showcase, data, showcase — reads as intentional instead of the run of three data sections feeling like one long stretch.
PRIORITY: **P2**

**14. Reconsider (or consciously commit to) the Reviews light-card pattern**
CURRENT: Review cards are the only light/white-background component on the entire page.
PROBLEM: Not wrong — it's a legitimate testimonial convention — but it's currently the one place the "dark, editorial" system breaks, without an explicit design note explaining why.
CHANGE: Either keep it and add a one-line rationale comment (so it reads as decided, not incidental) or bring it into the dark system to match every other card type.
RESULT: Every deviation from the page's dominant visual language is a deliberate, defensible choice — none read as an accident.
PRIORITY: **P3**

**15. Tighten the Footer's copyright/credit line semantics**
CURRENT: Copyright notice and "Website design by / Pictures by" credits share one `<p>` separated by a `<br />`.
PROBLEM: Minor accessibility nit — a screen reader announces this as one run-on paragraph.
CHANGE: Split into two elements (or use a `<small>` for the credit line).
RESULT: Cleaner semantics with zero visible change — the kind of detail that shows up well in an accessibility audit.
PRIORITY: **P3**

---

## Final assessment

**CURRENT SCORE: 7.5/10**
**POTENTIAL SCORE: 9.2/10** (achievable via the P0–P1 items above, without touching the visual identity)

**CURRENT PERCEIVED LEVEL: Senior (with a coachable systemization gap)**
**POTENTIAL LEVEL: Senior+**

### "If I showed this website in a senior web design interview tomorrow, what would the hiring manager notice within the first 30 seconds?"

The Hero would land immediately — the parallax, the calibrated gradient, the confident type scale, the badge placement all read as considered within the first two seconds, and that's usually enough to earn genuine attention rather than a skim. Scrolling into the Gallery-over-Hero overlap collage would reinforce it — that's a non-obvious layout technique, not a template pattern. By the time a reviewer reached How It Works' escalating numbered rail, they'd likely already be thinking "interview," not "reject." The first thing that would *cost* points in that same 30–60 second window is almost certainly the Reviews subtitle copy tone-drop if they scroll that far fast, or — for a technically-minded reviewer who opens dev tools — the moment they notice the root font-size override or spot two different hex values doing the same job in two files. Visually, nothing in the first 30 seconds reads as amateur; the risk is entirely in the small systemization gaps surfacing once someone looks closely, which is exactly the "almost right" territory this review focused on.

### "What are the 5 changes that would create the biggest improvement in perceived seniority?"

1. Fix the Reviews subtitle copy (P0 #1) — the single most visible tone lapse on the page, at a high-trust moment.
2. Replace the What You Get typewriter effect (P0 #3) — removes the one motion-language outlier on an otherwise disciplined site.
3. Consolidate the three near-duplicate background hex values into one token (P0 #2) — small in visual effect, large in what it signals about engineering discipline to anyone who reads the code.
4. Establish the 3-tier spacing system (P1 #6) and the single divider token (P1 #7) together — these two fixes, done as one pass, would retroactively make almost every section on the page look like it was built from one system rather than iterated section-by-section over time.
5. Give Pricing's recommended tier a real CTA-level signal (P1 #4) — the highest-leverage conversion fix on the list, and it directly strengthens the section the code itself already identifies as one of the site's three best.

---

*No changes have been made to the site. This document is a review only — implementation should proceed section by section, on your explicit approval of specific items above.*
