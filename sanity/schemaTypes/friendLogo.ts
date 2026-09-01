import { defineField, defineType } from "sanity";

// Mirrors galleryImage/facilityPhoto: a simple ordered image list, one
// document per logo in the "Our Friends" strip after FAQ. `url` is optional
// so a logo can just be decorative if the partner doesn't have a page to
// link to.
export default defineType({
  name: "friendLogo",
  title: "Friend Logo",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "Used as the image's alt text - not displayed on the page.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link (optional)",
      description: "Where the logo links to, if anywhere.",
      type: "url",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({
      name: "scale",
      title: "Size adjustment",
      description:
        "All logos display at the same box size by default (1 = normal). Some source logos are drawn with more empty padding than others and end up looking smaller/bigger side by side even at the same box size - lower this (e.g. 0.7) to shrink just this one logo down to match, or raise it (e.g. 1.2) to make it bigger. Leave blank for normal size.",
      type: "number",
      validation: (Rule) => Rule.min(0.3).max(1.5),
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
