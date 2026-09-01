import { defineField, defineType } from "sanity";

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "One entry per paragraph. Most FAQs only need one; a few (like Pre-arrival preparation) have several.",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "category",
      title: "Group label",
      type: "string",
      description: 'Shown as a small cyan label above the first question in this group, e.g. "Training", "Booking", "Equipment", "Arrival". Leave blank to show no group label. Group items that share a label together using Order below.',
      options: {
        list: ["Training", "Booking", "Equipment", "Arrival"],
      },
    }),
    defineField({
      name: "highlight",
      title: "Highlighted callout (optional)",
      type: "object",
      description: "Pulls one key fact out of the answer into its own callout, e.g. a recommendation. Leave both fields blank if this FAQ doesn't need one.",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", description: 'e.g. "Our recommendation"' }),
        defineField({ name: "text", title: "Text", type: "string" }),
      ],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers show first",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "question" },
  },
});
