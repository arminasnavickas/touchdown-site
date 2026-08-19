import { defineField, defineType } from "sanity";

// Shared field set used by both privacyPolicy and termsAndConditions below -
// these are singleton documents (one per page) rather than lists, matching
// the pattern used for siteContent.
const legalFields = [
  defineField({
    name: "lastUpdated",
    title: "Last updated",
    type: "date",
  }),
  defineField({
    name: "sections",
    title: "Sections",
    type: "array",
    of: [
      {
        type: "object",
        name: "legalSection",
        fields: [
          defineField({ name: "heading", title: "Heading", type: "string" }),
          defineField({
            name: "body",
            title: "Body paragraphs",
            type: "array",
            of: [{ type: "text", rows: 4 }],
          }),
        ],
        preview: {
          select: { title: "heading" },
        },
      },
    ],
  }),
];

export const privacyPolicy = defineType({
  name: "privacyPolicy",
  title: "Privacy Policy",
  type: "document",
  fields: legalFields,
  preview: {
    prepare: () => ({ title: "Privacy Policy" }),
  },
});

export const termsAndConditions = defineType({
  name: "termsAndConditions",
  title: "Terms & Conditions",
  type: "document",
  fields: legalFields,
  preview: {
    prepare: () => ({ title: "Terms & Conditions" }),
  },
});
