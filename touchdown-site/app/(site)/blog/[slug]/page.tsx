import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeImage from "@/components/FadeImage";
import BlogBody from "@/components/BlogBody";
import BlogPostCard from "@/components/BlogPostCard";
import BlogAuthorBlock from "@/components/BlogAuthorBlock";
import TableOfContents from "@/components/TableOfContents";
import ShareButton from "@/components/ShareButton";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import BackToTop from "@/components/BackToTop";
import { ClockIcon, CalendarIcon } from "@/components/BlogIcons";
import { getBlogPost, getBlogPosts, getTeamMembers } from "@/lib/content";
import { estimateReadingTime, extractHeadings } from "@/lib/blog";

export const revalidate = 60;

// The hero photograph is meant to break out wider than the reading column
// beneath it (a deliberate editorial "wide image, narrow text" pairing) -
// both numbers are plain pixel values rather than Tailwind's rem-based
// max-w-* scale, since this site runs html { font-size: 80% }, which would
// otherwise quietly shrink e.g. max-w-5xl to ~819px instead of the 1024px
// it looks like on paper.
const HERO_WIDTH = "max-w-[1040px]";
const TEXT_WIDTH = "max-w-[720px]";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const [post, allPosts, team] = await Promise.all([
    getBlogPost(params.slug),
    getBlogPosts(),
    getTeamMembers(),
  ]);
  if (!post) notFound();

  // allPosts is sorted newest-first by getBlogPosts(); "next" chronologically
  // is the item before this one in that order, "previous" is the item after.
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  // Same-category posts first, then top up to three total with anything
  // else so "Keep exploring" always has real substance behind it instead of
  // sometimes rendering with only one or two cards.
  const sameCategory = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const otherPosts = allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  const related = [...sameCategory, ...otherPosts].slice(0, 3);

  const readingTime = estimateReadingTime(post.body);
  const headings = extractHeadings(post.body);
  const avatar = post.author?.photo;

  return (
    <main className="bg-[#F4F8FA] px-6 py-16 md:px-16 md:py-24">
      <ReadingProgressBar />
      <article className={`mx-auto ${HERO_WIDTH}`}>
        <div className={`mx-auto ${TEXT_WIDTH}`}>
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-block font-switzer text-xs font-medium uppercase tracking-widest text-dark-ocean-blue/50 transition hover:text-cta md:text-sm"
            >
              ← Back to blog
            </Link>
            <ShareButton
              title={post.title}
              className="!text-xs !text-dark-ocean-blue/50 hover:!text-cta md:!text-sm"
            />
          </div>

          {post.category && (
            <p className="mb-3 font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
              {post.category}
            </p>
          )}
          <h1 className="mb-5 font-switzer text-3xl font-medium tracking-tight text-dark-ocean-blue md:text-4xl">
            {post.title}
          </h1>
          <div className="mb-10 flex flex-wrap items-center gap-2 font-switzer text-xs uppercase tracking-wide text-dark-ocean-blue/45 md:text-sm">
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="size-6 rounded-full object-cover" />
            )}
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {formatDate(post.publishedAt)}
              {post.author ? ` · ${post.author.name}` : ""}
            </span>
            <span className="text-dark-ocean-blue/25">·</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              {readingTime} min read
            </span>
          </div>
        </div>

        {/* Breaks out to the wider hero width - substantially larger than
            the text column it sits above and below, the deliberate
            "wide image, narrow text" editorial pairing. */}
        {post.coverImage && (
          <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-md md:mb-16">
            <FadeImage
              src={post.coverImage}
              alt={post.title}
              eager
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className={`mx-auto ${TEXT_WIDTH}`}>
          <TableOfContents headings={headings} />

          <BlogBody body={post.body} />

          <BlogAuthorBlock author={post.author ?? { name: "Touchdown Freediving", photo: null }} team={team} />

          {(newerPost || olderPost) && (
            <div className="mt-16 grid grid-cols-1 gap-8 border-t border-dark-ocean-blue/10 pt-10 md:grid-cols-2">
              {olderPost ? (
                <Link href={`/blog/${olderPost.slug}`} className="group block">
                  <p className="mb-2 font-switzer text-xs font-medium uppercase tracking-widest text-dark-ocean-blue/40">
                    ← Previous article
                  </p>
                  <p className="font-switzer text-lg font-light text-dark-ocean-blue transition group-hover:text-cta">
                    {olderPost.title}
                  </p>
                </Link>
              ) : (
                <div className="hidden md:block" />
              )}
              {newerPost && (
                <Link
                  href={`/blog/${newerPost.slug}`}
                  className="group block text-left md:text-right"
                >
                  <p className="mb-2 font-switzer text-xs font-medium uppercase tracking-widest text-dark-ocean-blue/40">
                    Next article →
                  </p>
                  <p className="font-switzer text-lg font-light text-dark-ocean-blue transition group-hover:text-cta">
                    {newerPost.title}
                  </p>
                </Link>
              )}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-20 w-full">
            <div className="mb-8 flex items-end justify-between gap-4 border-t border-dark-ocean-blue/10 pt-14">
              <div>
                <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
                  Keep exploring
                </p>
                <h2 className="mt-2 font-switzer text-3xl font-light tracking-tight text-dark-ocean-blue md:text-4xl">
                  More from the water
                </h2>
              </div>
              <Link
                href="/blog"
                className="group/link hidden shrink-0 items-center gap-1.5 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-dark-ocean-blue sm:flex"
              >
                View all articles
                <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogPostCard key={p.slug} post={p} />
              ))}
            </div>
            <Link
              href="/blog"
              className="group/link mt-10 flex w-fit items-center gap-1.5 font-switzer text-sm font-medium uppercase tracking-widest text-cta transition hover:text-dark-ocean-blue sm:hidden"
            >
              View all articles
              <span aria-hidden className="transition-transform duration-200 group-hover/link:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}
      </article>
      <BackToTop />
    </main>
  );
}
