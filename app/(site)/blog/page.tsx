import type { Metadata } from "next";
import Link from "next/link";
import FadeImage from "@/components/FadeImage";
import BlogPostCard from "@/components/BlogPostCard";
import BlogSearch from "@/components/BlogSearch";
import Reveal from "@/components/Reveal";
import BackToTop from "@/components/BackToTop";
import { ClockIcon, CalendarIcon } from "@/components/BlogIcons";
import { getBlogPosts } from "@/lib/content";
import { estimateReadingTime } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Training tips, Dahab guides, and stories from the Touchdown Freediving team.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: { category?: string; author?: string };
}) {
  const allPosts = await getBlogPosts();
  const categories = Array.from(
    new Set(allPosts.map((p) => p.category).filter((c): c is string => Boolean(c)))
  );

  const activeCategory = searchParams.category;
  const activeAuthor = searchParams.author;
  let posts = allPosts;
  if (activeCategory) posts = posts.filter((p) => p.category === activeCategory);
  if (activeAuthor) posts = posts.filter((p) => p.author?.name === activeAuthor);

  const [featured, ...rest] = posts;
  const featuredAvatar = featured?.author?.photo;

  return (
    // Container widened from the old max-w-6xl (1152px, and further
    // squeezed by rem-scaling) to a fixed 1280px - substantially more
    // breathing room on wide desktops without going full-bleed, and every
    // block on the page (header, featured story, grid, search overlay
    // trigger) shares this exact column so the whole homepage reads as one
    // consistent alignment grid rather than several differently-wide
    // stacked blocks.
    <main className="bg-[#F4F8FA]">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 text-center md:px-16 md:pb-14 md:pt-24">
        <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
          Blog
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-switzer text-5xl font-extralight tracking-tight text-dark-ocean-blue sm:text-6xl md:text-7xl">
          Stories from below the surface.
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-switzer text-lg font-light leading-relaxed text-dark-ocean-blue/60 md:text-xl">
          Training, technique, Dahab, and the people who make freediving what
          it is.
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mx-auto flex max-w-7xl items-center gap-6 border-b border-dark-ocean-blue/10 px-6 pb-5 md:px-16">
          {/* Horizontally scrollable, never wrapped - on mobile this stays
              one row that scrolls instead of breaking into multiple lines. */}
          <div className="flex flex-1 items-center gap-x-7 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-x-9">
            <Link
              href="/blog"
              className={`group relative shrink-0 py-1 font-switzer text-xs font-medium uppercase tracking-[0.2em] transition ${
                !activeCategory
                  ? "text-dark-ocean-blue"
                  : "text-dark-ocean-blue/35 hover:text-dark-ocean-blue/70"
              }`}
            >
              All
              <span
                className={`absolute -bottom-[1px] left-0 h-px bg-cta transition-all duration-300 ${
                  !activeCategory ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={`group relative shrink-0 py-1 font-switzer text-xs font-medium uppercase tracking-[0.2em] transition ${
                  activeCategory === cat
                    ? "text-dark-ocean-blue"
                    : "text-dark-ocean-blue/35 hover:text-dark-ocean-blue/70"
                }`}
              >
                {cat}
                <span
                  className={`absolute -bottom-[1px] left-0 h-px bg-cta transition-all duration-300 ${
                    activeCategory === cat ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>
          <BlogSearch posts={allPosts} />
        </div>
      )}

      {activeAuthor && (
        <div className="mx-auto max-w-7xl px-6 pt-6 md:px-16">
          <p className="font-switzer text-sm font-light text-dark-ocean-blue/50">
            Showing articles by{" "}
            <span className="text-dark-ocean-blue">{activeAuthor}</span>
            {" · "}
            <Link
              href={activeCategory ? `/blog?category=${encodeURIComponent(activeCategory)}` : "/blog"}
              className="text-cta transition hover:text-dark-ocean-blue"
            >
              Clear
            </Link>
          </p>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 pb-28 pt-10 md:px-16 md:pt-14">
        {posts.length === 0 ? (
          <p className="text-center font-switzer text-xl font-light text-dark-ocean-blue/60">
            No posts in this category yet.
          </p>
        ) : (
          <>
            {/* The dominant story on the page - a large 16:9 image with the
                category sitting subtly over it, then a substantially larger
                title than any grid card, a short excerpt, understated
                metadata, and a plain text "Read article" action instead of
                the old outlined button. */}
            <Reveal>
              <Link href={`/blog/${featured.slug}`} className="group mb-20 block md:mb-28">
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  {featured.coverImage ? (
                    <FadeImage
                      src={featured.coverImage}
                      alt={featured.title}
                      eager
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-horizon/25 to-dark-ocean-blue" />
                  )}
                  {featured.category && (
                    <>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-dark-ocean-blue/70 to-transparent" />
                      <span className="absolute bottom-4 left-4 font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:bottom-6 md:left-6 md:text-sm">
                        {featured.category}
                      </span>
                    </>
                  )}
                </div>
                <div className="mx-auto mt-8 max-w-3xl md:mt-10">
                  <h2 className="font-switzer text-3xl font-medium tracking-tight text-dark-ocean-blue transition group-hover:text-cta md:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-5 max-w-2xl font-switzer text-lg font-light leading-relaxed text-dark-ocean-blue/60 md:text-xl">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap items-center gap-2 font-switzer text-xs uppercase tracking-wide text-dark-ocean-blue/40">
                    {featuredAvatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featuredAvatar} alt="" className="size-5 rounded-full object-cover" />
                    )}
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="size-3" />
                      {formatDate(featured.publishedAt)}
                      {featured.author ? ` · ${featured.author.name}` : ""}
                    </span>
                    <span className="text-dark-ocean-blue/25">·</span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="size-3" />
                      {estimateReadingTime(featured.body)} min read
                    </span>
                  </div>
                  <span className="mt-6 flex w-fit items-center gap-1.5 font-switzer text-sm font-medium uppercase tracking-widest text-cta">
                    Read article
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* A plain 3-column CSS grid - it naturally supports any future
                post count (4, 7, 10...); the current fallback content has
                exactly four posts left after the featured one, which is why
                the last row shows a single card today. That's the grid
                doing its job, not a bug to special-case around - the row
                fills in on its own the moment a fifth post exists. */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Reveal key={post.slug} delay={Math.min(i * 60, 240)}>
                    <BlogPostCard post={post} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <BackToTop />
    </main>
  );
}
