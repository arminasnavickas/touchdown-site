"use client";

import { useState } from "react";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import type { TeamMember } from "@/lib/content";
import { InstagramIcon, GlobeIcon } from "./SocialIcons";
import Blob from "./Blob";
import Reveal from "./Reveal";
import ArticleModal from "./ArticleModal";

// Per-member vertical crop offset for the hero photo (CSS object-position
// Y%). Most source photos read fine cropped from the very top (0%, the
// default below); a few have extra blank studio backdrop above the
// subject's head, so only those get nudged down here instead of shifting
// the shared default and risking clipping into everyone else's hair.
const PHOTO_Y_OFFSET_BY_NAME: Record<string, number> = {
  "Maksim Kalnibolotskii": 18,
};

// Small fixed-pixel nudge on top of the percentage offset above, for
// fine-tuning individual photos a few px further down without having to
// re-derive their percentage equivalent (which shifts with each photo's
// own height). Combined with the percentage offset via calc() below.
const PHOTO_Y_NUDGE_PX: Record<string, number> = {
  Gus: 10,
  Omar: 10,
  "Maksim Kalnibolotskii": 15,
  Denis: 15,
  Ilia: 15,
};

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
        className="relative -mb-px aspect-[6/4.2] w-full cursor-zoom-in overflow-hidden"
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
            style={{
              // Subtract, not add: with object-fit: cover, a *lower*
              // (more negative) offset is what crops the top of the photo
              // away and reveals more of what's below - same direction as
              // the existing percentage offsets above. Adding the px nudge
              // instead pushed the image down past its top-aligned
              // position and exposed the card's own background as a solid
              // band across the top of the photo.
              objectPosition: `50% calc(${PHOTO_Y_OFFSET_BY_NAME[member.name] ?? 0}% - ${PHOTO_Y_NUDGE_PX[member.name] ?? 0}px)`,
            }}
          />
        </div>
      </button>

      {/* data-fab-avoid: same floating Book In/back-to-top overlap issue we
          hit on How It Works, Training Rhythm, and the footer links - the
          floating stack sits over this card's bio text and Read more link
          when scrolled into that position. Tagging the whole content block
          (not just the button) so the fade-out triggers as soon as any of
          the bio/CTA is covered, not only once the button itself is hit. */}
      <div data-fab-avoid className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <p className="font-switzer text-3xl font-light tracking-tight text-aquatic">
            {member.name}
          </p>
          {member.records && (
            <p className="font-switzer text-sm font-medium uppercase tracking-wide text-cta">
              {member.records}
            </p>
          )}
        </div>
        <p className="font-switzer text-xl font-light leading-relaxed text-white/80">
          {member.bio}
        </p>
        <button
          type="button"
          onClick={() => onOpen(index)}
          className="group/link relative inline-block w-fit font-switzer text-base font-medium text-cta transition hover:text-white"
        >
          Read more
          <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover/link:w-full" />
        </button>
        {(member.instagram || member.website) && (
          <div className="mt-auto flex gap-4 border-t border-white/10 pt-4 text-white/60">
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on Instagram`}
                className="transition hover:text-cta"
              >
                <InstagramIcon />
              </a>
            )}
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name}'s website`}
                className="transition hover:text-cta"
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
    <section
      id="team"
      className="relative flex flex-col items-center gap-[100px] overflow-hidden px-6 py-28 md:px-16 scroll-mt-20"
    >
      <Blob className="left-0 top-[8%] h-[320px] w-[320px]" />
      <Blob className="bottom-[6%] right-0 h-[340px] w-[340px]" />
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
            kicker: members[openIndex].records ?? undefined,
            avatar: members[openIndex].image,
            instagram: members[openIndex].instagram ?? undefined,
            paragraphs: [
              ...members[openIndex].fullBio,
              ...(members[openIndex].qualifications.length
                ? [`Background & qualifications: ${members[openIndex].qualifications.join(". ")}.`]
                : []),
            ],
          }}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((members.length + openIndex - 1) % members.length)}
          onNext={() => setOpenIndex((openIndex + 1) % members.length)}
        />
      )}
    </section>
  );
}
