import Loading from "@/components/loading/Loading";
import MainSection from "@/components/products/MainSection";
import { usePrivacyStore } from "@/stores/privacyStore";

import { useEffect, useRef, useState } from "react";

const PrivacyAndPolicy = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const { data, isLoading, error, fetchPrivacy } = usePrivacyStore();

  useEffect(() => {
    fetchPrivacy();
  }, [fetchPrivacy]);

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

    const current = sectionRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <main className="main-p !pt-0">
      <MainSection
        title="Privacy Policies"
        para="Your trust matters to us. Learn how we protect your data and ensure a safe, secure shopping experience."
        imgUrl="/privacy_policies.jpg"
      />

      <div
        ref={sectionRef}
        className={`container main-p overflow-hidden flex flex-col transform transition-all duration-700 ease-out ${
          sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {isLoading && <Loading />}
        {error && <p>{error}</p>}
        {data && (
          <>
            <h2 className="text-2xl md:text-3xl text-[#3A3A3A] mb-6 font-bold">{data.title}</h2>
            <div className="flex flex-col text-[#616161] space-y-4" dangerouslySetInnerHTML={{ __html: data.body }} />
          </>
        )}
      </div>
    </main>
  );
};

export default PrivacyAndPolicy;
