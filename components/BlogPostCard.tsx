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

export default function BlogPostCard({ post }: { post: BlogPost }) {
  const readingTime = estimateReadingTime(post.body);
  const avatar = post.author?.photo;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-dark-ocean-blue/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      {post.coverImage ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <FadeImage
            src={post.coverImage}
            alt={post.title}
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* subtle navy tint so images borrowed from elsewhere on the site read as one consistent "blog photography" set */}
          <div className="pointer-events-none absolute inset-0 bg-dark-ocean-blue/10 mix-blend-multiply" />
          {post.category && (
            <span className="absolute right-4 top-4 w-fit rounded-full bg-white px-3 py-1.5 font-switzer text-[10px] font-semibold uppercase tracking-wide text-dark-ocean-blue shadow-sm">
              {post.category}
            </span>
          )}
        </div>
      ) : (
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-horizon/15 to-aquatic/15">
          {post.category && (
            <span className="absolute right-4 top-4 w-fit rounded-full bg-white px-3 py-1.5 font-switzer text-[10px] font-semibold uppercase tracking-wide text-dark-ocean-blue shadow-sm">
              {post.category}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-switzer text-2xl font-light tracking-tight text-dark-ocean-blue transition group-hover:text-cta">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-4 mt-2 line-clamp-3 font-switzer text-lg font-light leading-relaxed text-dark-ocean-blue/60">
            {post.excerpt}
          </p>
        )}
        <span className="mt-auto inline-block w-fit rounded-[6px] border border-dark-ocean-blue/20 px-8 py-4 font-switzer text-sm font-medium uppercase tracking-wide text-dark-ocean-blue/70 transition group-hover:border-cta group-hover:text-cta">
          Read more
        </span>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-dark-ocean-blue/10 pt-4 font-switzer text-sm font-light text-dark-ocean-blue/45">
          {avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="size-5 rounded-full object-cover" />
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
      </div>
    </Link>
  );
}
