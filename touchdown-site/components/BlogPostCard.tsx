import Link from "next/link";
import FadeImage from "./FadeImage";
import { ClockIcon, CalendarIcon } from "./BlogIcons";
import type { BlogPost } from "@/lib/content";
import { estimateReadingTime } from "@/lib/blog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Editorial grid card - no card chrome (was a bordered, shadowed, rounded
// white box). The photograph is the strongest element, category/title/
// excerpt sit directly on the page's own paper background, and "Read more"
// is now a text link rather than an outlined button, matching the rest of
// the site's secondary-link language.
export default function BlogPostCard({ post }: { post: BlogPost }) {
  const readingTime = estimateReadingTime(post.body);
  const avatar = post.author?.photo;

  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
        {post.coverImage ? (
          <FadeImage
            src={post.coverImage}
            alt={post.title}
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-horizon/15 to-aquatic/15" />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        {post.category && (
          <span className="font-switzer text-xs font-semibold uppercase tracking-[0.2em] text-cta">
            {post.category}
          </span>
        )}
        <h2 className="mt-3 font-switzer text-2xl font-medium tracking-tight text-dark-ocean-blue transition group-hover:text-cta md:text-3xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-2 font-switzer text-base font-light leading-relaxed text-dark-ocean-blue/60">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dark-ocean-blue/10 pt-3">
          <div className="flex flex-wrap items-center gap-2 font-switzer text-xs uppercase tracking-wide text-dark-ocean-blue/40">
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="size-4 rounded-full object-cover" />
            )}
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="text-dark-ocean-blue/25">·</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              {readingTime} min read
            </span>
          </div>
          <span className="group/link flex w-fit shrink-0 items-center gap-1.5 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition group-hover:text-cta">
            Read article
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
