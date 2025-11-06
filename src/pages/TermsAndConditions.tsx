import MainSection from "@/components/products/MainSection";
import { useEffect, useRef, useState } from "react";

const TermsAndConditions = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [sectionVisible, setSectionVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <main className="main-p  !pt-0">
      <MainSection
        title="Terms and Conditions"
        para="Know your rights and our commitments. Read our terms for a clear and secure shopping experience."
        imgUrl="/terms_and_conditions.jpg"
      />

      <div
        ref={sectionRef}
        className={`container main-p overflow-hidden flex flex-col transform transition-all duration-700 ease-out ${
          sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-2xl md:text-3xl text-[#3A3A3A] mb-6 font-bold">USER AGREEMENT AND POLICES</h2>

        <div className="flex flex-col gap-4 mb-5">
          <p className="text-[#616161]">
            Static websites serve as the foundation for numerous online platforms, evolving into essential tools that shape the work of web designers and developers
            alike. These sites provide a streamlined approach to content delivery, ensuring quick load times and a seamless user experience.
          </p>
          <p className="text-[#616161]">
            As the digital landscape continues to grow, static websites are increasingly utilized for various applications, from personal blogs to corporate landing
            pages. Their simplicity allows for easy maintenance and updates, making them a popular choice for businesses looking to establish an online presence without
            the complexity of dynamic sites.
          </p>
          <p className="text-[#616161]">
            In this context, static websites not only enhance user engagement but also support the development of innovative web solutions. They empower creators to focus
            on design and functionality, paving the way for a more efficient web development process.
          </p>
          <p className="text-[#616161]">
            As we explore the terms and conditions of using these platforms, it's crucial to understand the implications of static site usage, including data privacy and
            user rights. This ensures that both developers and users can navigate the web responsibly and securely.
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermsAndConditions;
