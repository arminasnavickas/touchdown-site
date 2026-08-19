import { defineField, defineType } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Short bio (card preview)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullBio",
      title: "Full bio (shown in the \"Read more\" modal)",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "One entry per paragraph of their full personal story.",
    }),
    defineField({
      name: "qualifications",
      title: "Qualifications / background",
      type: "array",
      of: [{ type: "string" }],
      description: "One entry per line, shown in a summary sentence at the end of the full bio modal.",
    }),
    defineField({
      name: "records",
      title: "Records / credentials line",
      type: "string",
      description: 'e.g. "-130m NLT / -107m CWT / -94m FIM"',
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "website",
      title: "Personal website URL",
      type: "url",
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
    select: { title: "name", media: "photo" },
  },
});
