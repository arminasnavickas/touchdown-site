import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Touchdown Freediving — Content",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Content")
              .child(
                S.document().schemaType("siteContent").documentId("siteContent")
              ),
            S.divider(),
            S.listItem()
              .title("Homepage Sections")
              .child(
                S.list()
                  .title("Homepage Sections")
                  .items([
                    S.listItem()
                      .title("Hero Slide")
                      .child(
                        S.documentTypeList("heroSlide")
                          .title("Hero Slide")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("Gallery Image")
                      .child(
                        S.documentTypeList("galleryImage")
                          .title("Gallery Image")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("Facility Photo")
                      .child(
                        S.documentTypeList("facilityPhoto")
                          .title("Facility Photo")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("How It Works Step")
                      .child(
                        S.documentTypeList("howItWorksStep")
                          .title("How It Works Step")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("What You Get Item")
                      .child(
                        S.documentTypeList("whatYouGetItem")
                          .title("What You Get Item")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("Training Rhythm Day")
                      .child(
                        S.documentTypeList("scheduleDay")
                          .title("Training Rhythm Day")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("Schedule Card (Water/Dry Day)")
                      .child(
                        S.documentTypeList("scheduleCard")
                          .title("Schedule Card (Water/Dry Day)")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("Pricing Tier")
                      .child(
                        S.documentTypeList("pricingTier")
                          .title("Pricing Tier")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("Team Member")
                      .child(
                        S.documentTypeList("teamMember")
                          .title("Team Member")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("Review")
                      .child(
                        S.documentTypeList("review")
                          .title("Review")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("FAQ Item")
                      .child(
                        S.documentTypeList("faqItem")
                          .title("FAQ Item")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                    // Rendered last on the homepage, right after FAQ - kept
                    // in that same spot here so the Studio list order
                    // matches the page order.
                    S.listItem()
                      .title("Friend Logo")
                      .child(
                        S.documentTypeList("friendLogo")
                          .title("Friend Logo")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                  ])
              ),
            S.listItem()
              .title("Blog")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.listItem()
                      .title("Blog Post")
                      .child(
                        S.documentTypeList("blogPost")
                          .title("Blog Post")
                          .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
                      ),
                    // Each Blog Post's "Author" field references one of
                    // these - a name + photo that isn't tied to a Team
                    // Member, so a post can credit a guest writer or any
                    // custom byline. The type already existed in the schema
                    // (sanity/schemaTypes/author.ts) but had no sidebar
                    // entry, same gap Facility Photo had before it got one.
                    S.listItem()
                      .title("Author")
                      .child(
                        S.documentTypeList("author").title("Author")
                      ),
                  ])
              ),
            S.listItem()
              .title("Legal Pages")
              .child(
                S.list()
                  .title("Legal Pages")
                  .items([
                    S.listItem()
                      .title("Privacy Policy")
                      .child(
                        S.document().schemaType("privacyPolicy").documentId("privacyPolicy")
                      ),
                    S.listItem()
                      .title("Terms & Conditions")
                      .child(
                        S.document().schemaType("termsAndConditions").documentId("termsAndConditions")
                      ),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
