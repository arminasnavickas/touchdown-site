import type { Metadata } from "next";
import Link from "next/link";
import FadeImage from "@/components/FadeImage";
import BlogPostCard from "@/components/BlogPostCard";
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
  searchParams: { category?: string };
}) {
  const allPosts = await getBlogPosts();
  const categories = Array.from(
    new Set(allPosts.map((p) => p.category).filter((c): c is string => Boolean(c)))
  );

  const activeCategory = searchParams.category;
  const posts = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts;

  const [featured, ...rest] = posts;
  const featuredAvatar = featured?.author?.photo;

  return (
    <main className="bg-[#F4F8FA]">
      <div className="px-6 pb-8 pt-12 text-center md:px-16 md:pt-16">
        <h1 className="font-switzer text-6xl font-extralight tracking-tight text-dark-ocean-blue md:text-8xl">
          Blog
        </h1>
        <p className="mt-4 font-switzer text-lg font-light text-dark-ocean-blue/60">
          Training tips, Dahab guides, and stories from the water
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mb-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-dark-ocean-blue/10 px-6 pb-5 md:px-16">
          <Link
            href="/blog"
            className={`group relative font-switzer text-sm font-medium uppercase tracking-widest transition ${
              !activeCategory
                ? "text-dark-ocean-blue"
                : "text-dark-ocean-blue/35 hover:text-dark-ocean-blue/70"
            }`}
          >
            All
            <span
              className={`absolute -bottom-1 left-0 h-[2px] bg-horizon transition-all duration-300 ${
                !activeCategory ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className={`group relative font-switzer text-sm font-medium uppercase tracking-widest transition ${
                activeCategory === cat
                  ? "text-dark-ocean-blue"
                  : "text-dark-ocean-blue/35 hover:text-dark-ocean-blue/70"
              }`}
            >
              {cat}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-horizon transition-all duration-300 ${
                  activeCategory === cat ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 pb-28 md:px-16">
        {posts.length === 0 ? (
          <p className="text-center font-switzer text-xl font-light text-dark-ocean-blue/60">
            No posts in this category yet.
          </p>
        ) : (
          <>
            {/* Featured hero post - card with image on top, tinted text panel below */}
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group mb-20 block overflow-hidden rounded-lg border border-dark-ocean-blue/10 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                {featured.coverImage ? (
                  <div className="relative h-[320px] w-full overflow-hidden md:h-[440px]">
                    <FadeImage
                      src={featured.coverImage}
                      alt={featured.title}
                      eager
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-dark-ocean-blue/10 mix-blend-multiply" />
                    {featured.category && (
                      <span className="absolute right-4 top-4 w-fit rounded-full bg-white px-3 py-1.5 font-switzer text-[10px] font-semibold uppercase tracking-wide text-dark-ocean-blue shadow-sm">
                        {featured.category}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative h-[320px] w-full bg-gradient-to-br from-horizon/30 to-dark-ocean-blue md:h-[440px]">
                    {featured.category && (
                      <span className="absolute right-4 top-4 w-fit rounded-full bg-white px-3 py-1.5 font-switzer text-[10px] font-semibold uppercase tracking-wide text-dark-ocean-blue shadow-sm">
                        {featured.category}
                      </span>
                    )}
                  </div>
                )}
                <div className="bg-white p-8 md:p-10">
                  <h2 className="font-switzer text-3xl font-extralight tracking-tight text-dark-ocean-blue md:text-5xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-4 font-switzer text-lg font-light leading-relaxed text-dark-ocean-blue/70">
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="mt-10 inline-block w-fit rounded-[6px] border border-dark-ocean-blue/20 px-8 py-4 font-switzer text-sm font-medium uppercase tracking-wide text-dark-ocean-blue/70 transition group-hover:border-cta group-hover:text-cta">
                    Read more
                  </span>
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-dark-ocean-blue/10 pt-5 font-switzer text-sm font-light text-dark-ocean-blue/45">
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
                </div>
              </Link>
            </Reveal>

            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <Reveal key={post.slug}>
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
