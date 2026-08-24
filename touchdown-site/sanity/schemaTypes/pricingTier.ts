import { defineField, defineType } from "sanity";

export default defineType({
  name: "pricingTier",
  title: "Pricing Tier",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Plan name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'e.g. "3 Days", "1 Month"',
    }),
    defineField({
      name: "step",
      title: "Ladder step",
      description: 'Short verb-phrase framing this tier\'s place in the progression, e.g. "Try it", "Master it".',
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: 'e.g. "€450"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "features",
      title: "Included features",
      type: "array",
      of: [{ type: "pricingFeature" }],
    }),
    defineField({
      name: "bonus",
      title: "Bonus line (optional)",
      type: "string",
    }),
    defineField({
      name: "quote",
      title: "Testimonial quote (short - one line)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "quoteAuthor",
      title: "Quote attribution",
      description: 'e.g. "Student" - kept generic since these are trimmed marketing lines, not sourced testimonials.',
      type: "string",
      initialValue: "Student",
    }),
    defineField({
      name: "popular",
      title: "Highlight as Most Popular",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
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
    select: { title: "name", subtitle: "price" },
  },
});
