import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./sanityClient";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: Image) {
  if (!builder) return "";
  return builder.image(source).auto("format").fit("max").url();
}
