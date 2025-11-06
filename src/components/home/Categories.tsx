import type { CategoryDisplay, CategoryRoot } from "@/types/categories";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface CategoriesProps {
  showArrow?: boolean;
  categories: CategoryDisplay[] | CategoryRoot[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadImage?: boolean;
}

export default function Categories({ showArrow, categories, isLoading, error, onRetry, loadImage = false }: CategoriesProps) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    const sectionElement = sectionRef.current;
    if (sectionElement) observer.observe(sectionElement);
    return () => {
      if (sectionElement) observer.unobserve(sectionElement);
    };
  }, []);

  const getImageUrl = (category: CategoryDisplay | CategoryRoot): string => {
    if ("imageUrl" in category) {
      return category.imageUrl || "/placeholder.webp";
    }
    const imageUrl = category?.picture_model?.image_url;
    return loadImage ? imageUrl || "/placeholder.webp" : "/placeholder.webp";
  };

  return (
    <section ref={sectionRef} className="py-12 relative overflow-hidden">
      <img src="/dots.png" alt="dots element" className="absolute top-0 left-0 w-[340px] h-[340px] -z-1" />

      <div className="container">
        <div className={`mb-12 flex items-center justify-between z-10 transform transition-all duration-700 ${visible ? "opacity-100 -translate-y-0" : "opacity-0 -translate-y-5"}`}>
          <div>
            <h2 className="text-4xl font-bold text-[#3A3A3A]">Our Categories</h2>
            <p className="text-[#5C5C5C] mt-2">Explore a diverse range of categories tailored to your needs.</p>
          </div>

          {showArrow && (
            <Link to="/products" className="hidden lg:flex items-center text-[#7D7D7D] hover:text-primary group transition-all duration-300 text-lg">
              Find out more
              <ArrowRight className="size-5 ms-2 group-hover:ms-4 transition-all duration-300" />
            </Link>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold">Error loading categories</p>
              <p className="text-sm mt-2">{error}</p>
              {onRetry && (
                <button onClick={onRetry} className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {!isLoading && !error && categories && categories.length > 0 && (
          <div className="relative flex items-center">
            <Swiper
              modules={[Navigation]}
              slidesPerView={1.2}
              spaceBetween={30}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3.2 },
                1280: { slidesPerView: 4 },
              }}
              className="!overflow-visible xl:!overflow-hidden !-mx-4 !px-4"
            >
              {categories.map((category, index) => (
                <SwiperSlide key={category.id}>
                  <div
                    className={`bg-white relative overflow-hidden w-full group h-[190px] transform transition-all duration-700 ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                    style={{ transitionDelay: visible ? `${index * 120}ms` : "0ms" }}
                  >
                    <Link to={`/products/filter/${category.id}`} onClick={() => window.scrollTo(0, 0)}>
                      <img
                        src={getImageUrl(category)}
                        alt={category.name}
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.webp";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 backdrop-blur-[1px] to-transparent transition-colors duration-300 group-hover:bg-black/50" />
                      <p className="absolute left-0 w-full text-center text-xl font-bold text-white transition-all duration-300 ease-in-out bottom-4 group-hover:bottom-1/2 group-hover:translate-y-1/2">
                        {category.name}
                      </p>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {categories.length > 4 && (
              <>
                <ChevronLeft className="swiper-button-prev hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-primary text-primary cursor-pointer hover:bg-primary hover:text-white transition-all duration-300" />
                <ChevronRight className="swiper-button-next hidden md:flex absolute xl:left-[95%] 2xl:left-[100%] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-primary text-primary cursor-pointer hover:bg-primary hover:text-white transition-all duration-300" />
              </>
            )}
          </div>
        )}

        {!isLoading && !error && categories && categories.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500 text-center">
              <p className="text-lg">No categories available</p>
              <p className="text-sm mt-2">Categories will appear here once they are loaded.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end mt-12 lg:hidden">
          <Link to="/categories" className="flex items-center text-[#7D7D7D] hover:text-primary group transition-all duration-300 text-lg">
            Find out more
            <ArrowRight className="size-5 ms-2 group-hover:ms-4 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
