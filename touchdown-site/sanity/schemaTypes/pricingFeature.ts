import { defineField, defineType } from "sanity";

// Reusable object type for a pricing tier's included-features list. Split
// into a count + label pair (rather than one free-text string) so the UI
// can render the numeric benefit system ("04  Lectures") without having to
// parse a leading number back out of a sentence.
export default defineType({
  name: "pricingFeature",
  title: "Pricing Feature",
  type: "object",
  fields: [
    defineField({
      name: "count",
      title: "Count",
      description: 'e.g. "01", "04", "12" - shown as the small numeral to the left of the label.',
      type: "string",
    }),
    defineField({ name: "label", title: "Label", type: "string" }),
  ],
  preview: {
    select: { title: "label", subtitle: "count" },
  },
});
