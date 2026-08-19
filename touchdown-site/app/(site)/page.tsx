import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import WhoWeAre from "@/components/WhoWeAre";
import HowItWorks from "@/components/HowItWorks";
import WhatYouGet from "@/components/WhatYouGet";
import TrainingRhythm from "@/components/TrainingRhythm";
import WaterDaySchedule from "@/components/WaterDaySchedule";
import DryDaySchedule from "@/components/DryDaySchedule";
import Pricing from "@/components/Pricing";
import MeetOurTeam from "@/components/MeetOurTeam";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import FloatingActions from "@/components/FloatingActions";
import {
  getSiteContent,
  getFaqItems,
  getTeamMembers,
  getPricingTiers,
  getReviews,
  getScheduleDays,
  getWaterDayCards,
  getDryDayCards,
  getWhatYouGetItems,
  getHowItWorksSteps,
  getGalleryImages,
  getHeroSlides,
} from "@/lib/content";

// Revalidate content from Sanity every 60s (falls back to hardcoded content
// instantly if Sanity isn't connected yet — see lib/content.ts).
export const revalidate = 60;

export default async function Home() {
  const [
    siteContent,
    faqItems,
    teamMembers,
    pricingTiers,
    reviews,
    scheduleDays,
    waterDayCards,
    dryDayCards,
    whatYouGetItems,
    howItWorksSteps,
    galleryImages,
    heroSlides,
  ] = await Promise.all([
    getSiteContent(),
    getFaqItems(),
    getTeamMembers(),
    getPricingTiers(),
    getReviews(),
    getScheduleDays(),
    getWaterDayCards(),
    getDryDayCards(),
    getWhatYouGetItems(),
    getHowItWorksSteps(),
    getGalleryImages(),
    getHeroSlides(),
  ]);

  return (
    <main>
      <Hero headline={siteContent.heroHeadline} subcopy={siteContent.heroSubcopy} slides={heroSlides} />
      <Gallery images={galleryImages} />
      <WhoWeAre
        heading={siteContent.whoWeAreHeading}
        copy={siteContent.whoWeAreCopy}
        image={siteContent.whoWeAreImage}
      />
      <HowItWorks
        heading={siteContent.howItWorksHeading}
        subtitle={siteContent.howItWorksSubtitle}
        steps={howItWorksSteps}
      />
      <WhatYouGet items={whatYouGetItems} heading={siteContent.whatYouGetHeading} />
      <TrainingRhythm days={scheduleDays} heading={siteContent.trainingRhythmHeading} />
      <WaterDaySchedule
        cards={waterDayCards}
        heading={siteContent.waterDayHeading}
        subcopy={siteContent.waterDaySubcopy}
      />
      <DryDaySchedule
        cards={dryDayCards}
        heading={siteContent.dryDayHeading}
        subcopy={siteContent.dryDaySubcopy}
      />
      <Pricing tiers={pricingTiers} kicker={siteContent.pricingKicker} />
      <MeetOurTeam members={teamMembers} kicker={siteContent.teamKicker} />
      <Reviews reviews={reviews} subtitle={siteContent.reviewsSubtitle} />
      <Faq items={faqItems} />
      <FloatingActions />
    </main>
  );
}
