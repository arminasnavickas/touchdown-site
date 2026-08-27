import { defineField, defineType } from "sanity";

export default defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Reviewer name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / description",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "string",
      initialValue: "5 / 5",
    }),
    defineField({
      name: "quote",
      title: "Review text",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
    defineField({
      name: "visible",
      title: "Show this review",
      type: "boolean",
      initialValue: true,
      description:
        "Turn off to hide this one review from the Reviews section without deleting it - flip it back on any time to bring it back.",
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
    select: { title: "name", subtitle: "role", media: "photo", visible: "visible" },
    prepare({ title, subtitle, media, visible }) {
      return {
        title,
        subtitle: visible === false ? `Hidden - ${subtitle || ""}` : subtitle,
        media,
      };
    },
  },
});
