"use client";

import { useState } from "react";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import type { TeamMember } from "@/lib/content";
import { GlobeIcon } from "./SocialIcons";
import Reveal from "./Reveal";
import ArticleModal from "./ArticleModal";

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
const PHOTO_Y_OFFSET_BY_NAME: Record<string, number> = {};

// Per-member focal position for the PROFILE PANEL's hero image (separate
// from the card crop above - the modal frame is a completely different
// aspect ratio/height, so a member who needs no override on the card can
// still need one here, and vice versa). Defaults to "center top" for every
// member, which keeps the full head in frame at the new taller hero height;
// override individual entries only if a specific photo's subject sits low
// enough in the source frame that top-anchoring cuts their shoulders off
// awkwardly instead.
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
  return (
    // Un-boxed - the old dark-ocean-blue rounded card with its own shadow
    // and hover-lift made a grid of eight read as a dense wall of tiles.
    // The portrait now sits straight on the section's own navy background
    // (no card chrome at all beyond the photo's own rounded corners), taller
    // and genuinely portrait-shaped (was a short 6/3.6 landscape crop) so
    // the person, not the card, is what the eye lands on.
    <div className="group flex h-full w-full flex-col gap-4">
      <button
        type="button"
        onClick={() => openLightbox([member.image], 0)}
        className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-md"
        aria-label="View full image"
      >
        <FadeImage
          src={member.image}
          alt={member.name}
          wrapperClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ objectPosition: `50% ${PHOTO_Y_OFFSET_BY_NAME[member.name] ?? 0}%` }}
        />
      </button>

      {/* data-fab-avoid: same floating Book In/back-to-top overlap issue we
          hit on How It Works, Training Rhythm, and the footer links. */}
      <div data-fab-avoid className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-switzer text-2xl font-light tracking-tight text-aquatic">
            {member.name}
          </p>
          <p className="font-switzer text-xs font-medium uppercase tracking-wide text-cta">
            {member.role}
          </p>
        </div>
        {/* Depth records removed from the card (still passed into the
            ArticleModal below via `stats`, so they remain fully visible in
            each member's popup) - the grid now leads with name/role/bio
            only, kept clean and scannable; performance data lives one tap
            away in the detailed profile instead of competing with it here. */}
        {/* Clamped to 2 lines (was the full bio, uncapped) - now that the
            photo is the dominant element and taller, letting every card's
            bio run to a different length made the grid's bottom edge
            ragged; the popup is still one tap away for the rest. */}
        <p className="line-clamp-2 font-switzer text-[15px] font-light leading-relaxed text-white/70">
          {member.bio}
        </p>
        {/* Bottom action row - Instagram (secondary, left, muted) and Meet
            (primary, right, cyan) now share one baseline instead of Meet
            sitting in its own row above the divider. The left wrapper
            always renders (even with no instagram/website) so
            justify-between always has two flex children and Meet stays
            pinned to the row's right edge; mt-auto keeps this whole row at
            the same vertical position across every card regardless of how
            long each member's bio runs. */}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-3">
          <div className="flex items-center gap-4">
            {/* Instagram as an intentional "Instagram ->" text link instead
                of a lone icon - matches the treatment used in the modal
                header, rather than an unlabeled glyph sitting on its own. */}
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-switzer text-sm font-medium uppercase tracking-widest text-white/60 transition hover:text-cta"
              >
                Instagram
                <span aria-hidden>→</span>
              </a>
            )}
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name}'s website`}
                className="text-white/60 transition hover:text-cta"
              >
                <GlobeIcon />
              </a>
            )}
          </div>
          {/* Personalized CTA ("Meet Gus") replacing the generic "Read more" -
              styled like How It Works' demoted read-more link (small
              uppercase text + arrow) rather than the old underline-on-hover
              treatment, to match the rest of the site's secondary-link
              style. Now the row's primary action, right-aligned opposite
              Instagram. */}
          <button
            type="button"
            onClick={() => onOpen(index)}
            className="group/link flex shrink-0 items-center gap-1.5 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-white"
          >
            Meet {member.name.split(" ")[0]}
            <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
              →
            </span>
          </button>
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
    // Glow removed - the team's own photography carries this section, and
    // cyan glow is now reserved for Hero/How It Works/Pricing only. Gap
    // trimmed from the old flat gap-[100px] to something more intentional.
    <section
      id="team"
      className="relative flex flex-col items-center gap-14 overflow-hidden px-6 py-20 md:gap-16 md:px-16 scroll-mt-20"
    >
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
          <p className="font-switzer text-lg font-light leading-relaxed text-danish-blue md:text-xl">
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
            title: members[openIndex].name,
            // Full portrait via `image` (the rectangular hero-photo
            // treatment already built for How It Works), not `avatar` - the
            // small circular crop reads as a footnote, not the header photo
            // a profile panel should open with. "tall" + top-anchored so
            // the full head stays in frame instead of getting cropped off
            // the way the old fixed-height hero did.
            image: members[openIndex].image,
            imageSize: "tall",
            imagePosition: MODAL_IMAGE_POSITION_BY_NAME[members[openIndex].name] ?? "center top",
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
