"use client";

import { useState } from "react";
import Blob from "./Blob";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import type { TeamMember } from "@/lib/content";
import Reveal from "./Reveal";
import ArticleModal from "./ArticleModal";
import { InstagramIcon, GlobeIcon } from "./SocialIcons";

// Per-member vertical crop offset for the hero photo (CSS object-position
// Y%). Most source photos read fine cropped from the very top (0%, the
// default below); a few have extra blank studio backdrop above the
// subject's head, so only those get nudged down here instead of shifting
// the shared default and risking clipping into everyone else's hair.
// Currently empty - Maksim's photo used to need an 18% nudge here to skip
// blank studio backdrop above his head, but that was because the source
// file was a tall 2:3 portrait while every other team photo is a square
// (~1:1). That mismatch was also why his lightbox popup had a visibly
// different shape from everyone else's. Fixed at the source instead: the
// file itself is now cropped to match the rest of the team's square ratio,
// so this map goes back to needing per-member overrides only if a future
// photo genuinely needs one.
//
// Team photos can now also carry a crop/focal point set in Sanity Studio
// (member.imagePosition, from the photo field's hotspot) - that's used as
// the default whenever a member has no entry here, so this map is only for
// the rare case where the code-level override still needs to win.
// Card title overrides, for when the CMS entry has no role set.
const ROLE_OVERRIDE_BY_NAME: Record<string, string> = {
  Omar: "Manager",
  "Maksim Kalnibolotskii": "Instructor",
  Francesco: "Physiotherapist and osteopath",
  Denis: "Instructor",
  Ilia: "Freediving and yoga instructor",
};

// Card and popup show first names only for these members.
const DISPLAY_NAME_BY_NAME: Record<string, string> = {
  "Maksim Kalnibolotskii": "Maksim",
};

// Backdrop fill for members nudged down, sampled from the top edge of each
// photo (left to right) so the gap above the picture blends in.
const BACKDROP_BY_NAME: Record<string, string> = {
  Ilia: "linear-gradient(to right, #e4e4e4, #dadada 50%, #c9c9c9)",
  Denis: "linear-gradient(to right, #f5f5f5, #f2f2f2 50%, #ebebeb)",
};

const PHOTO_NUDGE_PX_BY_NAME: Record<string, { x: number; y: number }> = {
  // Pixel nudges from the base crop. Positive x moves the picture right,
  // positive y moves it down. Example: Gus: { x: 0, y: 24 },
  "Maksim Kalnibolotskii": { x: 0, y: -40 },
  Denis: { x: 0, y: 15 },
  Ilia: { x: 0, y: 30 },
};

// Per-member focal position for the PROFILE PANEL's hero image (separate
// from the card crop above - the modal frame is a completely different
// aspect ratio/height, so a member who needs no override on the card can
// still need one here, and vice versa). Defaults to "center top" for every
// member, which keeps the full head in frame at the new taller hero height;
// override individual entries only if a specific photo's subject sits low
// enough in the source frame that top-anchoring cuts their shoulders off
// awkwardly instead. Same Sanity hotspot fallback as the card map above -
// member.imagePosition is used whenever a member has no entry here.
const MODAL_IMAGE_POSITION_BY_NAME: Record<string, string> = {};

function TeamCard({
  member,
  index,
  onOpen,
}: {
  member: TeamMember;
  index: number;
  onOpen: (index: number) => void;
}) {
  const { openLightbox } = useLightbox();
  // Role line + short description. When a member has no role of their own,
  // the bio's first sentence ("Founder of TOUCHDOWN.") becomes the role
  // label and the rest of the bio is the description, so the card always
  // reads name, role, one short line instead of a bio cut off mid list.
  const bioText = (member.bio ?? "").trim();
  const firstSentenceEnd = bioText.search(/[.!?](\s|$)/);
  const hasSentences = firstSentenceEnd > 0 && firstSentenceEnd < bioText.length - 1;
  const roleOverride = ROLE_OVERRIDE_BY_NAME[member.name];
  const roleLine = roleOverride || member.role?.trim() || (hasSentences ? bioText.slice(0, firstSentenceEnd) : "");
  const description = roleOverride || member.role?.trim()
    ? bioText
    : hasSentences
      ? bioText.slice(firstSentenceEnd + 1).trim()
      : bioText;
  return (
    // Un-boxed - the old dark-ocean-blue rounded card with its own shadow
    // and hover-lift made a grid of eight read as a dense wall of tiles.
    // The portrait now sits straight on the section's own navy background
    // (no card chrome at all beyond the photo's own rounded corners), taller
    // and genuinely portrait-shaped (was a short 6/3.6 landscape crop) so
    // the person, not the card, is what the eye lands on.
    // data-fab-avoid moved up to cover the whole card (was only on the text
    // block below) - the floating Book/back-to-top stack was still landing
    // on the photo itself, since only the text portion opted out of the
    // overlap check.
    <div data-fab-avoid className="group flex h-full w-full flex-col gap-3">
      <button
        type="button"
        onClick={() => openLightbox([member.image], 0)}
        className="relative aspect-square w-full shrink-0 cursor-zoom-in isolate overflow-hidden rounded-md bg-[#f2f2f2]"
        style={BACKDROP_BY_NAME[member.name] ? { background: BACKDROP_BY_NAME[member.name] } : undefined}
        aria-label="View full image"
      >
        <FadeImage
          src={member.image}
          alt={member.name}
          wrapperClassName="h-full w-full rounded-md"
          // Several source photos (Gus, Omar, Denis) carry a thin dark strip
          // baked into their right edge. Rendering the image 8px wider than
          // its frame lets the frame's overflow-hidden clip that strip off.
          className="h-full w-[calc(100%+8px)] max-w-none object-cover"
          style={{
            // Up nudges crop from the top via object-position. Down nudges
            // translate the image; the frame's light backdrop fills the gap.
            objectPosition: `calc(50% + ${(PHOTO_NUDGE_PX_BY_NAME[member.name]?.x ?? 0)}px) calc(0% + ${Math.min(PHOTO_NUDGE_PX_BY_NAME[member.name]?.y ?? 0, 0)}px)`,
            translate: `0 ${Math.max(PHOTO_NUDGE_PX_BY_NAME[member.name]?.y ?? 0, 0)}px`,
          }}
        />
      </button>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          {/* Name is the primary text element right after the photo -
              deliberately the largest, boldest-weight text on the card. */}
          <p className="font-switzer text-2xl font-medium tracking-tight text-white md:text-3xl">
            {DISPLAY_NAME_BY_NAME[member.name] ?? member.name}
          </p>
          {roleLine && (
            <p className="font-switzer text-xs font-medium uppercase tracking-widest text-cta">
              {roleLine}
            </p>
          )}
        </div>
        {/* Depth records removed from the card (still passed into the
            ArticleModal below via `stats`, so they remain fully visible in
            each member's popup) - the grid now leads with name/role/bio
            only, kept clean and scannable; performance data lives one tap
            away in the detailed profile instead of competing with it here. */}
        {/* Clamped to 2 lines (was the full bio, uncapped) - now that the
            photo is the dominant element and taller, letting every card's
            bio run to a different length made the grid's bottom edge
            ragged; the popup is still one tap away for the rest. Width
            capped to 90% so the paragraph doesn't stretch edge-to-edge
            across the card. */}
        <p className="line-clamp-3 w-[90%] font-switzer text-[15px] font-light leading-relaxed text-white/70">
          {description}
        </p>
        {/* Bottom action row - Instagram (secondary, left, muted) and Meet
            (primary, right, cyan) now share one baseline. The left wrapper
            always renders (even with no instagram/website) so
            justify-between always has two flex children and Meet stays
            pinned to the row's right edge. mt-6 gives guaranteed breathing
            room above the row (was mt-auto, which had no room to push
            against once the bio was clamped to 2 lines). The divider sits
            below this row (border-b + pb-4) as the card's bottom edge,
            instead of above it. */}
        <div className="mt-auto flex items-center justify-between gap-4 border-b border-white/10 pb-4 pt-4">
          {/* Meet is the one clear action: an outlined button on the left.
              Instagram / website are secondary and shrink to small icon
              links on the right. */}
          <button
            type="button"
            onClick={() => onOpen(index)}
            className="group/link order-2 flex shrink-0 items-center gap-2 rounded-md border border-white/[0.08] bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015)_60%,rgba(0,191,255,0.02))] px-4 py-2 font-switzer text-sm font-medium uppercase tracking-widest text-cta shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [backdrop-filter:blur(8px)] transition hover:border-cta/30 hover:bg-white/[0.06]"
          >
            Meet {member.name.split(" ")[0]}
          </button>
          <div className="order-1 flex items-center gap-3 text-white/60">
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on Instagram`}
                className="transition hover:text-cta [&_svg]:size-6"
              >
                <InstagramIcon />
              </a>
            )}
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} website`}
                className="transition hover:text-cta [&_svg]:size-6"
              >
                <GlobeIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MeetOurTeam({
  members,
  kicker,
}: {
  members: TeamMember[];
  kicker: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    // Glow removed at one point, then brought back (see Blob below) - the
    // team's own photography still carries most of this section, so this
    // one stays at the top edge rather than sitting behind the photo grid
    // itself. Gap trimmed from the old flat gap-[100px] to something more
    // intentional.
    <section
      id="team"
      className="relative flex flex-col items-center gap-14 px-6 py-[40px] md:gap-16 md:px-16 scroll-mt-20"
    >
      {/* Top-center, bled upward into Pricing above (same
          later-section-paints-on-top logic as the other seam blobs on this
          page; Pricing already has no overflow-hidden of its own - see
          Pricing.tsx - so nothing on that side clips it either).
          overflow-hidden dropped from this section for the same reason as
          the others: it was clipping the blur into a hard line right at
          the boundary. opacity-40 (was 30 - the site's standard glow
          strength, see WaterDaySchedule.tsx for the full 3-tier scale) so
          this reads the same as every other supporting-section glow
          instead of one step dimmer for no particular reason. */}
      <Blob className="top-[-120px] left-1/2 h-[380px] w-[380px] -translate-x-1/2 opacity-40" />
      <Reveal>
        {/* "The people / Behind the practice" (was "Meet the team") - an
            eyebrow + statement pairing, matching the editorial masthead
            used elsewhere on the page, framing this section as being about
            credibility and experience before a single portrait is seen. */}
        <div className="relative z-10 flex max-w-2xl flex-col items-center gap-4 text-center">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
            The people
          </p>
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            Behind the practice
          </h2>
          <p className="font-switzer text-[15px] font-light leading-relaxed text-white/70">
            {kicker}
          </p>
        </div>
      </Reveal>
      <div className="relative z-10 grid w-full grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member, i) => (
          <Reveal key={member.name} delay={i * 80} className="h-full">
            <TeamCard member={member} index={i} onOpen={setOpenIndex} />
          </Reveal>
        ))}
      </div>

      {openIndex !== null && (
        <ArticleModal
          content={{
            title: DISPLAY_NAME_BY_NAME[members[openIndex].name] ?? members[openIndex].name,
            // Full portrait via `image` (the rectangular hero-photo
            // treatment already built for How It Works), not `avatar` - the
            // small circular crop reads as a footnote, not the header photo
            // a profile panel should open with. "tall" + top-anchored so
            // the full head stays in frame instead of getting cropped off
            // the way the old fixed-height hero did.
            image: members[openIndex].image,
            imageSize: "tall",
            imagePosition:
              MODAL_IMAGE_POSITION_BY_NAME[members[openIndex].name] ??
              members[openIndex].imagePosition ??
              "center top",
            subtitle: members[openIndex].role,
            instagram: members[openIndex].instagram ?? undefined,
            // Bare values here (no leading "-") to match the popup's own
            // stat-grid convention - the card is what prepends the minus
            // sign for its compact inline records line.
            stats: members[openIndex].records?.map((record) => ({
              value: record.value,
              label: record.label,
            })),
            sections: members[openIndex].bioSections,
            // Still required by ArticleModalContent's type, but only used
            // as a fallback when `sections` is empty - every team member
            // has bioSections, so this never actually renders.
            paragraphs: members[openIndex].fullBio,
            qualifications: members[openIndex].qualifications,
          }}
          currentIndex={openIndex}
          total={members.length}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((members.length + openIndex - 1) % members.length)}
          onNext={() => setOpenIndex((openIndex + 1) % members.length)}
        />
      )}
    </section>
  );
}
