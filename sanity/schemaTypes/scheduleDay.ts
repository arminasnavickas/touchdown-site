import { defineField, defineType } from "sanity";

export default defineType({
  name: "scheduleDay",
  title: "Training Rhythm Day",
  type: "document",
  fields: [
    defineField({ name: "day", title: "Day", type: "string" }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      options: { list: ["Water day", "Dry Day", "Day off"] },
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      description: "e.g. 07:00 - 18:00. Leave empty for days off.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "day", subtitle: "label" },
  },
});
