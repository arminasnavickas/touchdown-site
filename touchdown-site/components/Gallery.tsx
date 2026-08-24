"use client";

import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";

export default function Gallery({ images }: { images: string[] }) {
  const { openLightbox } = useLightbox();

  return (
    <section className="relative z-20 -mt-16 px-6 md:-mt-24 md:px-16">
      {/* Shadow softened from shadow-xl (a hard, generic drop shadow that
          made this read as a separate card floating on top of the hero) to
          a tinted, lower-spread shadow in the same dark-ocean-blue as the
          hero itself - the collage still overlaps the photo below it, but
          now reads as continuous with it instead of stacked on top. */}
      <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg shadow-lg shadow-dark-ocean-blue/30 md:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openLightbox(images, i)}
            className="cursor-zoom-in"
            aria-label="View full image"
          >
            <FadeImage
              src={src}
              alt=""
              wrapperClassName="h-[100px] w-full md:h-[300px]"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
