import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteContent",
  title: "Site Content",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      // Was "string" (a single-line input). A plain single-line field can
      // never actually hold a line break once a person edits it - pressing
      // Enter in that box does nothing, so any edit silently collapsed the
      // intended "small line + big headline" into one line and blanked out
      // the big headline on the live site (2026-09-17). "text" gives editors
      // a real multi-line box where Enter works, so the format below is
      // actually achievable through Studio, not just through seed data.
      type: "text",
      rows: 2,
      description:
        'Two lines, with a real line break between them (press Enter here). First line: the small label above the headline, e.g. "Freediving school". Second line: the big headline itself, e.g. "Consistently delivering quality". One line with no break is also fine - it just renders as the big headline with no small label above it.',
      initialValue: "Freediving school\nFounded by Gus Kreivenas",
    }),
    defineField({
      name: "heroSubcopy",
      title: "Hero subcopy",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "whoWeAreHeading",
      title: '"Who we are" heading',
      type: "string",
      initialValue: "Who we are",
    }),
    defineField({
      name: "whoWeAreCopy",
      title: '"Who we are" body copy',
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "whoWeAreImage",
      title: '"Who we are" image',
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "facilityHeading",
      title: '"Where you\'ll train" (facility section) heading',
      type: "string",
      initialValue: "Where you'll train",
    }),
    defineField({
      name: "facilityCopy",
      title: '"Where you\'ll train" (facility section) body copy',
      description: "One paragraph per line — each line renders as its own paragraph.",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "howItWorksHeading",
      title: '"How it works" heading',
      type: "string",
      initialValue: "How it works",
    }),
    defineField({
      name: "howItWorksSubtitle",
      title: '"How it works" subtitle',
      type: "string",
      initialValue: "Learn the fundamentals. Practice with guidance. Progress with confidence.",
    }),
    defineField({
      name: "pricingKicker",
      title: "Pricing section kicker",
      type: "string",
      initialValue: "Group Training Experience",
    }),
    defineField({
      name: "teamKicker",
      title: "Team section kicker",
      type: "string",
      initialValue: "Your Dreams Are Our Goals!",
    }),
    defineField({
      name: "reviewsSubtitle",
      title: "Reviews section subtitle",
      type: "string",
      initialValue: "We Love our students so much and they love us too :)",
    }),
    defineField({
      name: "showReviews",
      title: "Show Reviews section",
      type: "boolean",
      initialValue: true,
      description:
        "Turn off to hide the whole Reviews section from the homepage (and its Reviews nav link) without deleting any of the review entries - flip it back on any time to bring it back.",
    }),
    defineField({
      name: "blogEnabled",
      title: "Blog enabled",
      type: "boolean",
      initialValue: false,
      description:
        "Turn on once real blog posts are ready to go live. While off, the Blog nav link and footer link are hidden, /blog and individual posts redirect to the homepage, and blog pages are left out of the sitemap. The sample posts stay in place either way - they're just not reachable until this is on.",
    }),
    defineField({
      name: "trainingRhythmHeading",
      title: "Training Rhythm heading",
      type: "string",
      initialValue: "Training Rhythm",
    }),
    defineField({
      name: "waterDayHeading",
      title: "Water Day Schedule heading",
      type: "string",
      initialValue: "Water Day Schedule",
    }),
    defineField({
      name: "waterDaySubcopy",
      title: "Water Day Schedule subcopy (one paragraph per line)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "dryDayHeading",
      title: "Dry Day Schedule heading",
      type: "string",
      initialValue: "Dry Day Schedule",
    }),
    defineField({
      name: "dryDaySubcopy",
      title: "Dry Day Schedule subcopy",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "whatYouGetHeading",
      title: "What You Get heading",
      type: "string",
      initialValue: "What you get",
    }),
    defineField({
      name: "friendsHeading",
      title: '"Our Friends" (logo strip after FAQ) heading',
      type: "string",
      initialValue: "Our friends",
    }),
    defineField({
      name: "notFoundHeadline",
      title: "404 page headline",
      type: "string",
      initialValue: "Looks like you've gone off the line",
    }),
    defineField({
      name: "notFoundSubtext",
      title: "404 page subtext",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "notFoundImage",
      title: "404 page background image",
      description:
        "Click \"Edit\" on the uploaded image to crop it and drag the focal point (hotspot) circle - the live page keeps that focal point in view at every screen size instead of always centering the image.",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "notFoundTextColor",
      title: "404 page text color",
      description:
        "Color of the \"404\" label, headline and subtext over the background image. Defaults to Dark Ocean Blue (#023048) if left empty.",
      type: "color",
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: "footerEmail",
      title: "Footer email",
      type: "string",
      initialValue: "info@touchdownfreediving.com",
    }),
    defineField({
      name: "footerPhone",
      title: "Footer phone (used for both display text and the tel: link)",
      type: "string",
    }),
    defineField({
      name: "footerLocation",
      title: "Footer location",
      type: "string",
      initialValue: "Dahab, Egypt",
    }),
    defineField({
      name: "footerTagline",
      title: "Footer tagline (the large CTA headline)",
      type: "string",
      initialValue: "Ready to Dive In?",
    }),
    defineField({
      name: "footerCtaSubcopy",
      title: "Footer CTA subcopy (small line under the tagline)",
      type: "string",
      initialValue: "Your next dive starts here.",
    }),
    defineField({
      name: "headerNavLinks",
      title: "Header navigation links",
      description: "Only the link text can be edited here — the id determines which page/section it actually points to, and is fixed to prevent broken links.",
      type: "array",
      of: [{ type: "footerLink" }],
    }),
    defineField({
      name: "footerAboutTitle",
      title: "Footer \"About\" column title",
      type: "string",
      initialValue: "About",
    }),
    defineField({
      name: "footerAboutLinks",
      title: "Footer \"About\" column links",
      description: "Only the link text can be edited here — the id determines which page/section it actually points to, and is fixed to prevent broken links.",
      type: "array",
      of: [{ type: "footerLink" }],
    }),
    defineField({
      name: "footerExperienceTitle",
      title: "Footer \"Experience\" column title",
      type: "string",
      initialValue: "Experience",
    }),
    defineField({
      name: "footerExperienceLinks",
      title: "Footer \"Experience\" column links",
      description: "Only the link text can be edited here — the id determines which page/section it actually points to, and is fixed to prevent broken links.",
      type: "array",
      of: [{ type: "footerLink" }],
    }),
    defineField({
      name: "footerLegalTitle",
      title: "Footer \"Legal\" column title",
      description: "Not currently displayed - Legal links now render as a compact inline list in the footer's bottom bar instead of a full column, and don't have a visible title there. Kept in case that layout changes again.",
      type: "string",
      initialValue: "Legal",
    }),
    defineField({
      name: "footerLegalLinks",
      title: "Footer \"Legal\" column links",
      description: "Only the link text can be edited here — the id determines which page/section it actually points to, and is fixed to prevent broken links.",
      type: "array",
      of: [{ type: "footerLink" }],
    }),
    defineField({
      name: "footerContactTitle",
      title: "Footer \"Contact\" column title",
      type: "string",
      initialValue: "Get in touch",
    }),
    defineField({
      name: "socialInstagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "socialTelegram",
      title: "Telegram URL",
      type: "url",
    }),
    defineField({
      name: "socialFacebook",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "socialWhatsapp",
      title: "WhatsApp URL",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Content" }),
  },
});
