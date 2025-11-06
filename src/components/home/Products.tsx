/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../products/ProductCard";

type props = {
  title: string;
  desc?: string;
  activeArrow?: boolean;
  link: string;
  linkText: string;
  products: any[];
  className?: string;
};

export default function Products({ title, desc, activeArrow, products, className }: props) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    const sectionElement = sectionRef.current; // Copy the current value to a variable
    if (sectionElement) observer.observe(sectionElement);
    return () => {
      if (sectionElement) observer.unobserve(sectionElement); // Use the copied value in the cleanup function
    };
  }, []);

  return (
    <section ref={sectionRef} className={`py-12 overflow-hidden relative ${className ? className : ""}`}>
      {!isBeginning && (
        <div
          className="absolute  start-[0] bottom-[25px] w-[150px]  h-[500px]
                         opacity-75 md:opacity-100 bg-gradient-to-l from-[#ffffff00] to-[#cecece88] backdrop-blur-[1.8px] pointer-events-none"
        />
      )}

      {!isEnd && (
        <div
          className="absolute  end-[0] bottom-[25px] w-[150px]  h-[500px]
                  opacity-75 md:opacity-100 bg-gradient-to-l from-[#cecece88] to-[#ffffff00] backdrop-blur-[1.8px] pointer-events-none"
        />
      )}
      <div className="container relative z-1 ">
        {/* Header */}
        <div
          className={`${!desc && "mb-12"} flex items-center justify-between transform transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] text-nowrap">{title}</h2>
          {/* {!activeArrow && (
            <Link to={link} className="hidden lg:flex items-center text-[#7D7D7D] hover:!text-primary group transition-all duration-300 text-lg">
              {linkText}
              <ArrowRight className="size-5 ms-2 group-hover:ms-4 transition-all duration-300" />
            </Link>
          )} */}
        </div>

        <p
          className={`text-[#7D7D7D] ${desc ? "mt-4 mb-12" : ""} transform transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } `}
        >
          {desc}
        </p>

        {/* Products Content */}
        {products.length > 0 ? (
          /* Swiper */
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            slidesPerView={1.2}
            spaceBetween={10}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
              1280: { slidesPerView: 4.1 },
            }}
            className="!overflow-visible relative"
            onReachBeginning={() => setIsBeginning(true)}
            onReachEnd={() => setIsEnd(true)}
            onFromEdge={() => {
              setIsBeginning(false);
              setIsEnd(false);
            }}
          >
            {activeArrow && (
              <>
                <ChevronLeft
                  className={`swiper-button-prev !z-10 absolute !hidden md:!flex -!left-15 top-[30px] -translate-y-[30px]
                             w-8 h-8 rounded-full border border-primary text-primary cursor-pointer
                             transition-opacity duration-300 shadow hover:text-white
                             disabled:!hidden disabled:cursor-not-allowed`}
                />
              </>
            )}
            {products.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`transform transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                  style={{
                    transitionDelay: visible ? `${index * 120}ms` : "0ms",
                  }}
                >
                  <ProductCard item={item} />
                </div>
              </SwiperSlide>
            ))}
            {activeArrow && (
              <>
                <ChevronRight
                  className="swiper-button-next  !hidden md:!flex  absolute xl:!left-[95%] 2xl:!left-[100%] top-[30px] -translate-y-[30px]
                           w-8 h-8 rounded-full border border-primary text-primary cursor-pointer
                             transition-opacity duration-300 shadow hover:text-white
                             disabled:!hidden disabled:cursor-not-allowed"
                />
              </>
            )}
          </Swiper>
        ) : (
          /* Empty State */
          <div
            className={`flex flex-col items-center justify-center py-16 text-center transform transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Available</h3>
            <p className="text-gray-500 max-w-md">We couldn't find any products in this category. Please check back later or explore our other collections.</p>
          </div>
        )}

        {/* Mobile Button */}
        {/* {!activeArrow && (
          <div className="flex items-center justify-center mt-12 lg:hidden">
            <Link to={link} className="flex items-center text-[#7D7D7D] hover:!text-primary group transition-all bg-primary/10 px-4 py-2 rounded-md duration-300 text-lg">
              {linkText}
              <ArrowRight className="size-5 ms-2 group-hover:ms-4 transition-all duration-300" />
            </Link>
          </div>
        )} */}
      </div>
    </section>
  );
}
