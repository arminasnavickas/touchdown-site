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
      name: "role",
      title: "Role tags (card + profile panel)",
      type: "string",
      description: 'e.g. "Founder · Instructor · Coach" - short role tags shown under the name on both the card and the popup.',
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
      title: "Full bio (flat fallback)",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "One entry per paragraph. Used only if Bio sections below is empty.",
    }),
    defineField({
      name: "bioSections",
      title: "Bio sections (shown in the profile panel)",
      type: "array",
      of: [{ type: "teamBioSection" }],
      description: "The member's story broken into titled sections, e.g. \"The beginning\" / \"Dahab\" / \"Today\".",
    }),
    defineField({
      name: "qualifications",
      title: "Qualifications / background",
      type: "array",
      of: [{ type: "string" }],
      description: "One entry per line, shown as a scannable list in the profile panel.",
    }),
    defineField({
      name: "records",
      title: "Depth records",
      type: "array",
      of: [{ type: "teamRecord" }],
      description: "One entry per record, e.g. 130m / NLT.",
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
