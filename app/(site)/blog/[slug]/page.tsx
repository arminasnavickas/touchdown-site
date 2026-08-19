import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeImage from "@/components/FadeImage";
import BlogBody from "@/components/BlogBody";
import BlogPostCard from "@/components/BlogPostCard";
import TableOfContents from "@/components/TableOfContents";
import ShareButton from "@/components/ShareButton";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import BackToTop from "@/components/BackToTop";
import { ClockIcon, CalendarIcon } from "@/components/BlogIcons";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { estimateReadingTime, extractHeadings } from "@/lib/blog";

export const revalidate = 60;

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
  const [post, allPosts] = await Promise.all([
    getBlogPost(params.slug),
    getBlogPosts(),
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

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);

  const readingTime = estimateReadingTime(post.body);
  const headings = extractHeadings(post.body);
  const avatar = post.author?.photo;

  return (
    <main className="bg-[#F4F8FA] px-6 py-28 md:px-16">
      <ReadingProgressBar />
      <article className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-dark-ocean-blue/10 pb-6">
          <Link
            href="/blog"
            className="inline-block font-switzer text-sm font-medium uppercase tracking-widest text-horizon transition hover:text-cta"
          >
            ← Back to blog
          </Link>
          <ShareButton title={post.title} />
        </div>

        <h1 className="mb-4 font-switzer text-4xl font-extralight tracking-tight text-dark-ocean-blue md:text-6xl">
          {post.title}
        </h1>
        <div className="mb-10 flex flex-wrap items-center gap-2 font-switzer text-sm font-light text-dark-ocean-blue/50">
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

        {post.coverImage && (
          <div className="relative mb-10 h-[300px] w-full overflow-hidden rounded-lg md:h-[440px]">
            <FadeImage
              src={post.coverImage}
              alt={post.title}
              eager
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-dark-ocean-blue/10 mix-blend-multiply" />
            {post.category && (
              <span className="absolute right-4 top-4 w-fit rounded-full bg-white px-2.5 py-0.5 font-switzer text-[10px] font-semibold uppercase tracking-wide text-dark-ocean-blue shadow-sm">
                {post.category}
              </span>
            )}
          </div>
        )}

        <TableOfContents headings={headings} />

        <BlogBody body={post.body} />

        {(newerPost || olderPost) && (
          <div className="mt-20 grid grid-cols-1 gap-8 border-t border-dark-ocean-blue/10 pt-10 md:grid-cols-2">
            {olderPost ? (
              <Link href={`/blog/${olderPost.slug}`} className="group block">
                <p className="mb-2 font-switzer text-sm font-medium uppercase tracking-widest text-horizon">
                  ← Previous
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
                <p className="mb-2 font-switzer text-sm font-medium uppercase tracking-widest text-horizon">
                  Next →
                </p>
                <p className="font-switzer text-lg font-light text-dark-ocean-blue transition group-hover:text-cta">
                  {newerPost.title}
                </p>
              </Link>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-switzer text-2xl font-light tracking-tight text-dark-ocean-blue">
              Related articles
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {related.map((p) => (
                <BlogPostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        )}
      </article>
      <BackToTop />
    </main>
  );
}
