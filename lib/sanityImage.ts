import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./sanityClient";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

type ImageOptions = {
  width?: number;
  quality?: number;
};

function buildImageUrl(source: Image, options: ImageOptions = {}) {
  const { width = 2000, quality = 75 } = options;
  return builder!
    .image(source)
    .auto("format")
    .fit("max")
    .width(width)
    .quality(quality)
    .url();
}

export function urlForImage(source?: Image | null, options?: ImageOptions) {
  // source is often null (e.g. a blog post author with no photo) - that's
  // valid, expected data, not an error. Without this guard, builder.image()
  // throws on null/undefined, which was silently tripping the try/catch in
  // lib/content.ts and falling all the way back to hardcoded placeholder
  // content. The try/catch below also covers a source that's present but
  // malformed (missing asset ref etc.), so a bad image never takes down an
  // entire section.
  if (!builder || !source) return "";
  try {
    return buildImageUrl(source, options);
  } catch {
    return "";
  }
}

export function srcSetForImage(source?: Image | null, widths = [640, 960, 1280, 1920]) {
  if (!builder || !source) return "";
  try {
    return widths.map((width) => `${buildImageUrl(source, { width })} ${width}w`).join(", ");
  } catch {
    return "";
  }
}
