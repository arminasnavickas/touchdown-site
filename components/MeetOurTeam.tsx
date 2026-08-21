"use client";

import { useState } from "react";
import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";
import type { TeamMember } from "@/lib/content";
import { InstagramIcon, GlobeIcon } from "./SocialIcons";
import Blob from "./Blob";
import Reveal from "./Reveal";
import ArticleModal from "./ArticleModal";

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
        className="relative -mb-px aspect-[6/4.9] w-full cursor-zoom-in overflow-hidden"
        aria-label="View full image"
      >
        <FadeImage
          src={member.image}
          alt={member.name}
          wrapperClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </button>

      <div className="flex flex-1 flex-col gap-4 p-5">
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
