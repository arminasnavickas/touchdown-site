import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Hero Slide",
  type: "document",
  fields: [
    defineField({ name: "image", title: "Image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls the order slides cycle through in the hero carousel.",
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { media: "image" },
    prepare: ({ media }) => ({ title: "Hero slide", media }),
  },
});
