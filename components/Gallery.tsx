"use client";

import FadeImage from "./FadeImage";
import { useLightbox } from "./LightboxContext";

export default function Gallery({ images }: { images: string[] }) {
  const { openLightbox } = useLightbox();

  return (
    <section className="relative z-20 -mt-16 px-6 md:-mt-24 md:px-16">
      <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg shadow-xl md:grid-cols-4">
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
              wrapperClassName="h-[150px] w-full md:h-[300px]"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
