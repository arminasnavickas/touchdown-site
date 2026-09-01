import { defineField, defineType } from "sanity";

// Reusable object type for one depth-record entry (e.g. "130m NLT"). Split
// into a value + label pair, stored WITHOUT a leading minus sign - the team
// card template prepends "-" for its compact inline records line, while the
// popup's stat grid renders the bare value, matching the two different
// conventions used across the card vs. the profile-panel mockups.
export default defineType({
  name: "teamRecord",
  title: "Team Record",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      description: 'e.g. "130m" - no leading minus sign.',
      type: "string",
    }),
    defineField({
      name: "label",
      title: "Label",
      description: 'e.g. "NLT", "CWT", "FIM"',
      type: "string",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});
