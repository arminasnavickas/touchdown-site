import { defineField, defineType } from "sanity";

export default defineType({
  name: "whatYouGetItem",
  title: "What You Get Item",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "copy", title: "Copy", type: "text", rows: 4 }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title" },
  },
});
