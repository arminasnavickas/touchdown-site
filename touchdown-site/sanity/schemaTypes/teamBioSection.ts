import { defineField, defineType } from "sanity";

// Reusable object type for one titled section of a team member's profile-
// panel biography (e.g. "The beginning", "Dahab", "Today"), so the modal can
// render a scannable, sectioned story instead of one long flat block of
// paragraphs.
export default defineType({
  name: "teamBioSection",
  title: "Team Bio Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      description: 'e.g. "The beginning", "Dahab", "Today"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
