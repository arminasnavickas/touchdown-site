import Reveal from "./Reveal";

// New section sitting between About Us and How It Works - the Blue Hole
// location and on-land amenities copy Francesca sent over. Matches the same
// centered eyebrow/heading/paragraph masthead pattern used by Team, Reviews,
// and FAQ (rather than About Us's own two-column photo layout), since there's
// no dedicated facility photo to pair it with yet.
export default function OurFacility() {
  return (
    <section
      id="facility"
      className="relative flex flex-col items-center gap-10 overflow-hidden px-6 py-20 md:px-16 scroll-mt-20"
    >
      <Reveal>
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="font-switzer text-xs font-semibold uppercase tracking-[0.25em] text-cta md:text-sm">
            The facility
          </p>
          <h2 className="font-switzer text-4xl font-extralight tracking-tight text-white md:text-6xl">
            Where you&rsquo;ll train
          </h2>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="relative z-10 flex max-w-3xl flex-col gap-4 text-center font-switzer text-[15px] font-light leading-relaxed text-white/80">
          <p>
            We train in Egypt&rsquo;s world-renowned Blue Hole, where 90
            metres of depth sit just a few steps from shore, sheltered from
            current and waves. This will give you the chance to experience
            real depth in calm, forgiving conditions while building trust and
            skill in open water. Our school keeps a dedicated space right at
            the site, so your equipment is always close at hand.
          </p>
          <p>
            On land, our facility is built to meet every freediver&rsquo;s
            needs: a yoga area and stretching zone to develop flexibility and
            breath control, a gym for strength work, and a classroom for dry
            practice to refine technique out of the water. Line training
            rounds out the routine, and recovery is built into the rhythm
            too, with bike rides, sauna sessions and ice baths supporting
            your body between training days, so you arrive at every session
            ready to perform and progress.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
