import type { MetadataRoute } from "next";
import { getBlogPosts, getSiteContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://touchdown-space.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Blog routes redirect to home while blogEnabled is off (see
  // app/(site)/blog/page.tsx and blog/[slug]/page.tsx) - leaving them out
  // of the sitemap here too keeps search engines from indexing/crawling a
  // page that just bounces back to "/".
  const siteContent = await getSiteContent();
  if (!siteContent.blogEnabled) return staticRoutes;

  const blogIndexRoute: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const posts = await getBlogPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogIndexRoute, ...postRoutes];
}
