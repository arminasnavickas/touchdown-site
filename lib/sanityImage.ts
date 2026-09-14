import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./sanityClient";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source?: Image | null) {
  // source is often null (e.g. a blog post author with no photo) - that's
  // valid, expected data, not an error. Without this guard, builder.image()
  // throws on null/undefined, which was silently tripping the try/catch in
  // lib/content.ts and falling all the way back to hardcoded placeholder
  // content. The try/catch below also covers a source that's present but
  // malformed (missing asset ref etc.), so a bad image never takes down an
  // entire section.
  if (!builder || !source) return "";
  try {
    return builder.image(source).auto("format").fit("max").url();
  } catch {
    return "";
  }
}
