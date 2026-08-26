import { defineField, defineType } from "sanity";

export default defineType({
  name: "facilityPhoto",
  title: "Facility Photo",
  type: "document",
  fields: [
    defineField({ name: "image", title: "Image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "alt", title: "Alt text", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "alt", media: "image" },
  },
});
