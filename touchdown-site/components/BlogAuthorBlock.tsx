import Link from "next/link";
import FadeImage from "./FadeImage";
import type { Author, TeamMember } from "@/lib/content";

// Best-effort link to the existing Team data - blog posts only ever carry a
// bare {name, photo} author (no separate id to key off), so this matches on
// first name rather than requiring a new required Sanity field. When
// nothing matches (e.g. the generic "Touchdown Freediving" byline), the
// block still renders cleanly with just the name.
function findTeamMember(author: Author, team: TeamMember[]): TeamMember | null {
  const authorFirstName = author.name.trim().split(/\s+/)[0]?.toLowerCase();
  if (!authorFirstName) return null;
  return (
    team.find((m) => m.name.trim().split(/\s+/)[0]?.toLowerCase() === authorFirstName) ?? null
  );
}

export default function BlogAuthorBlock({
  author,
  team,
}: {
  author: Author;
  team: TeamMember[];
}) {
  const member = findTeamMember(author, team);
  const photo = author.photo ?? member?.image ?? null;
  const role = member?.role;
  const bioLine = member?.bio;
  const firstName = author.name.trim().split(/\s+/)[0];

  return (
    <div className="mt-16 flex flex-col gap-5 border-t border-dark-ocean-blue/10 pt-10 sm:flex-row sm:items-start">
      <div className="flex flex-1 items-start gap-4">
        <div className="flex flex-col gap-3">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta">
            Written by
          </p>
          <div className="flex items-center gap-4">
            {photo ? (
              <FadeImage
                src={photo}
                alt={author.name}
                wrapperClassName="size-14 shrink-0 overflow-hidden rounded-full"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-dark-ocean-blue/10 font-switzer text-lg font-light text-dark-ocean-blue/50">
                {author.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <p className="font-switzer text-lg font-medium text-dark-ocean-blue">{author.name}</p>
              {role && (
                <p className="font-switzer text-sm font-medium uppercase tracking-wide text-cta">
                  {role}
                </p>
              )}
              {bioLine && (
                <p className="mt-1 max-w-md font-switzer text-sm font-light leading-relaxed text-dark-ocean-blue/60">
                  {bioLine}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Link
        href={`/blog?author=${encodeURIComponent(author.name)}`}
        className="group/link flex shrink-0 items-center gap-1.5 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-dark-ocean-blue sm:mt-8"
      >
        More from {firstName}
        <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}
