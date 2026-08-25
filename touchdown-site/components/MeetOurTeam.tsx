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
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-lg bg-dark-ocean-blue shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cta/10">
      <button
        type="button"
        onClick={() => openLightbox([member.image], 0)}
        className="relative -mb-px aspect-[6/3.6] w-full cursor-zoom-in overflow-hidden"
        aria-label="View full image"
      >
        {/* object-top-cropped photos were showing a large flat block of the
            subject's dark shirt at the bottom of the frame, which visually
            merged into the card's own dark-ocean-blue background below it -
            reading as one big black slab rather than a photo + card. A
            shorter crop keeps the frame on face/shoulders and trims that
            excess torso, so the photo's own bottom edge stays visible.

            The Y offset defaults to 0% (top-anchored, same as before) and
            is only overridden per-member via PHOTO_Y_OFFSET_BY_NAME above -
            set as an inline style since Tailwind can't generate an
            arbitrary-value class from a runtime variable.

            The wrapping div here bleeds 1px past the left/right edges
            (clipped by this button's own overflow-hidden either way), and
            the image itself is scaled up slightly (scale-105) so it
            overshoots its box on every side - between the two, any
            subpixel width-rounding gap that was showing the card's
            dark-ocean-blue background as a thin dark line down the right
            edge of the photo is fully covered. */}
        <div className="absolute -inset-x-px inset-y-0">
          <FadeImage
            src={member.image}
            alt={member.name}
            wrapperClassName="h-full w-full"
            className="h-full w-full scale-105 object-cover"
            style={{ objectPosition: `50% ${PHOTO_Y_OFFSET_BY_NAME[member.name] ?? 0}%` }}
          />
        </div>
      </button>

      {/* data-fab-avoid: same floating Book In/back-to-top overlap issue we
          hit on How It Works, Training Rhythm, and the footer links - the
          floating stack sits over this card's bio text and CTA link when
          scrolled into that position. Tagging the whole content block (not
          just the button) so the fade-out triggers as soon as any of the
          bio/CTA is covered, not only once the button itself is hit. */}
      <div data-fab-avoid className="flex flex-1 flex-col gap-3 p-5">
        {/* Name -> short role tags -> compact records line -> description,
            in that order, so the card reads "who / what they do / what
            they've done / a bit about them" top to bottom instead of
            burying the role under a name-sized records line. */}
        <div className="flex flex-col gap-1">
          <p className="font-switzer text-3xl font-light tracking-tight text-aquatic">
            {member.name}
          </p>
          <p className="font-switzer text-sm font-medium uppercase tracking-wide text-cta">
            {member.role}
          </p>
        </div>
        {member.records && member.records.length > 0 && (
          <p className="font-switzer text-sm font-light text-white/50">
            {member.records.map((record, i) => (
              <span key={record.label}>
                {i > 0 && <span className="mx-1.5 text-white/25">·</span>}
                -{record.value} <span className="text-white/35">{record.label}</span>
              </span>
            ))}
          </p>
        )}
        <p className="font-switzer text-xl font-light leading-relaxed text-white/80">
          {member.bio}
        </p>
        {/* Personalized CTA ("Meet Gus") replacing the generic "Read more" -
            styled like How It Works' demoted read-more link (small
            uppercase text + arrow) rather than the old underline-on-hover
            treatment, to match the rest of the site's secondary-link style. */}
        <button
          type="button"
          onClick={() => onOpen(index)}
          className="group/link flex w-fit items-center gap-1.5 pt-1 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-white"
        >
          Meet {member.name.split(" ")[0]}
          <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
            →
          </span>
        </button>
        {(member.instagram || member.website) && (
          <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-4">
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
        )}
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
        <div className="relative z-10 flex flex-col items-center gap-10 text-center">
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            Meet our team
          </h2>
          <p className="font-switzer text-base font-normal uppercase tracking-widest text-danish-blue">
            {kicker}
          </p>
        </div>
      </Reveal>
      <div className="relative z-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
