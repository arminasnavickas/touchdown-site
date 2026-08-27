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
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
