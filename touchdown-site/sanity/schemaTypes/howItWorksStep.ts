import { defineField, defineType } from "sanity";

export default defineType({
  name: "howItWorksStep",
  title: "How It Works Step",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g. Theory, Practice, Repetition, Results",
    }),
    defineField({ name: "image", title: "Image", type: "image" }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "First paragraph is used as the short card preview; all paragraphs show in the full modal.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
