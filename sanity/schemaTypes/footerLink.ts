import { defineField, defineType } from "sanity";

// Reusable object type for footer nav links. `id` is fixed (read-only) and
// determines the real href in code (see hrefById in Footer.tsx) - only
// `label`, the visible text, is meant to be edited here. This keeps the
// displayed wording fully editable in the Studio without any risk of a
// renamed link silently pointing at the wrong page/section.
export default defineType({
  name: "footerLink",
  title: "Footer Link",
  type: "object",
  fields: [
    defineField({ name: "id", title: "Link ID (do not change)", type: "string", readOnly: true }),
    defineField({ name: "label", title: "Link text", type: "string" }),
  ],
  preview: {
    select: { title: "label" },
  },
});
