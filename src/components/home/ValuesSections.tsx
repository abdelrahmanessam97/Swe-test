import { useEffect, useRef, useState } from "react";

const values: { image: string; title: string; para: string }[] = [
  {
    image: "/value2.svg",
    title: "Authenticate your product!",
    para: "100% original products.",
  },
  {
    image: "/value3.png",
    title: "Shop easily!",
    para: "Buy your products in a few clicks!",
  },
  {
    image: "/value1.svg",
    title: "Get rewarded!",
    para: "Earn points as you go. ",
  },
];

const ValuesSections = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current; // Create a local variable to capture the current value
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef); // Use the local variable in the cleanup function
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-[90%] mx-auto rounded-sm min-h-[130px] p-6 sm:p-8 bg-[#F9F9F9] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
      {values.map((value, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-center gap-4 text-center sm:text-left flex-col sm:flex-row transform transition-all duration-700 ${
            visible ? `opacity-100 translate-y-0 delay-[${idx * 150}ms]` : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: visible ? `${idx * 150}ms` : "0ms" }}
        >
          <img className="w-[24px] h-[24px] lg:w-12 lg:h-12 object-contain" src={value.image} alt={value.title} />
          <div>
            <h5 className="text-sm lg:text-lg font-bold text-[#3a3a3a] break-words">{value.title}</h5>
            <p className="text-sm lg:text-md font-light text-[#3a3a3a] mt-1">{value.para}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ValuesSections;
