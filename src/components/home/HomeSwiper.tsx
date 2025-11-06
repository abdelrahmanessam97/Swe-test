import { Button } from "@/components/ui/button";
import { useHomeStore } from "@/stores/homeStore";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ValuesSections from "./ValuesSections";

interface SlideElement extends HTMLDivElement {
  dataset: DOMStringMap & { id?: string };
}

const HomeSwiper = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { fetchSwiper, swiperItems, isLoading } = useHomeStore();

  const [visibleSlides, setVisibleSlides] = useState<Record<number, boolean>>({});
  const slideRefs = useRef<(SlideElement | null)[]>([]);

  // Fetch swiper items on mount
  useEffect(() => {
    fetchSwiper();
  }, [fetchSwiper]);

  // Handle visibility animation using Intersection Observer
  useEffect(() => {
    if (!swiperItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Number((entry.target as SlideElement).dataset.id);
          if (entry.isIntersecting && !visibleSlides[id]) {
            setVisibleSlides((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = slideRefs.current.filter((el): el is SlideElement => !!el);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [swiperItems, visibleSlides]);

  if (!swiperItems.length && !isLoading) return null;

  return (
    <section className="relative mb-0 lg:mb-24">
      <div className="relative w-full h-[65vh] md:h-[70vh] overflow-hidden hero-section" dir={isRTL ? "rtl" : "ltr"}>
        <Swiper
          key={i18n.language}
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={swiperItems.length > 1}
          className="w-full h-full"
        >
          {swiperItems.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${slide.picture_url})` }} />
                <div className="absolute inset-0 bg-black/40" />

                <div
                  ref={(el) => {
                    slideRefs.current[index] = el;
                  }}
                  data-id={String(slide.id)}
                  className={`h-full flex flex-col container items-center text-center lg:items-start justify-center lg:text-left transform transition-all duration-700 mb-12 ${
                    visibleSlides[slide.id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                >
                  <h1
                    className={`my-6  text-5xl font-bold lg:text-6xl text-white transform transition-all duration-700 delay-100 ${
                      visibleSlides[slide.id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                  >
                    {slide.title}
                  </h1>

                  <p
                    className={`mb-8  max-w-xl lg:text-xl text-white transform transition-all duration-700 delay-200 ${
                      visibleSlides[slide.id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                  >
                    {slide.description}
                  </p>

                  <div
                    className={`flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start transform transition-all duration-700 delay-300 ${
                      visibleSlides[slide.id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                  >
                    {slide.ctas?.length > 0 && slide.ctas[0].visible && (
                      <Button asChild className="w-fit mb-24 mx-auto md:mx-0 bg-white text-black hover:bg-white py-5">
                        <a href={`products/filter/${slide.ctas[0].url}`}>
                          {slide.ctas[0].label}
                          <ArrowRight className="size-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="hidden 2xl:flex swiper-button-prev-custom absolute left-1 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full items-center justify-center text-white transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="hidden 2xl:flex swiper-button-next-custom absolute right-1 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full items-center justify-center text-white transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="w-full relative lg:absolute bottom-25 md:bottom-25 lg:-bottom-20 left-0 z-10 px-4">
        <div className="mx-auto">
          <ValuesSections />
        </div>
      </div>
    </section>
  );
};

export default HomeSwiper;
