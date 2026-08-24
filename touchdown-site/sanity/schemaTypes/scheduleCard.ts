import { defineField, defineType } from "sanity";

export default defineType({
  name: "scheduleCard",
  title: "Schedule Card",
  type: "document",
  fields: [
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      options: { list: ["Water day", "Dry day"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "image", title: "Image", type: "image" }),
    defineField({ name: "copy", title: "Copy", type: "text", rows: 4 }),
    defineField({ name: "time", title: "Time", type: "string" }),
    defineField({
      name: "badge",
      title: "Time badge label",
      description: 'Short action word shown next to the time, e.g. "Pick-up", "In water".',
      type: "string",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "section", media: "image" },
  },
});
