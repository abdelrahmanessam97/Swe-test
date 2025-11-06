import { useEffect, useRef, useState } from "react";

const MainSection = ({ title, para, imgUrl }: { title?: string; para?: string; imgUrl?: string }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // trigger once
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section ref={ref} className="relative w-full max-h-[300px] overflow-hidden">
      <img src={imgUrl} alt={title} className={`w-full h-full object-cover transition-transform duration-700 ease-out scale-150`} />

      <div
        className={`absolute inset-0 bg-gradient-to-l from-transparent to-black flex items-end justify-start p-10 md:p-20 text-white transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
        }`}
      >
        <div className="max-w-[560px]">
          <h3 className="uppercase text-xl border-l-2 border-[#C21D0B] ps-3">{title}</h3>
          <p className="text-[#FFFFFFB5] mt-2 ps-3">{para}</p>
        </div>
      </div>
    </section>
  );
};

export default MainSection;
