import { useHomeStore, type FeatureItem } from "@/stores/homeStore";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const STORAGE_KEY = "features_has_animated";

interface IOElement extends HTMLDivElement {
  __io__?: IntersectionObserver;
}

export default function Features() {
  const { features = [], isLoading, fetchFeatures } = useHomeStore();
  const location = useLocation();
  const sectionRef = useRef<IOElement | null>(null);

  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  useEffect(() => {
    if (visible && typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
      sectionRef.current?.classList.add("has-animated");
    }
  }, [visible]);

  useEffect(() => {
    sectionRef.current?.classList.toggle("has-animated", visible);
  }, [visible, location.pathname]);

  const isInViewport = (el: Element) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = sectionRef.current;
    if (!el || visible || features.length === 0) return;

    if (isInViewport(el)) {
      setVisible(true);
      return;
    }

    const rafId = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );

      observer.observe(el);
      el.__io__ = observer;
    });

    return () => {
      cancelAnimationFrame(rafId);
      el.__io__?.disconnect();
      delete el.__io__;
    };
  }, [features.length, visible]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!features.length) return null;

  const getFeatureLink = (feature: FeatureItem) => feature.Link?.trim() || "#";
  const displayFeatures = features.slice(0, 4);
  const baseAnim = "transition-all duration-300 transform will-change-transform will-change-opacity";
  const animState = visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <section ref={sectionRef} className={`py-12 ${visible ? "has-animated" : ""}`}>
      <div className="container">
        <div className="flex flex-col gap-5 md:flex-row flex-wrap lg:flex-nowrap">
          {/* First Feature */}
          {displayFeatures[0] && (
            <div className={`w-full md:w-[calc(50%-20px)] lg:w-6/12 hover:lg:w-7/12 transition-all duration-300 group ${baseAnim} ${animState}`}>
              <div className="h-[220px] md:h-[350px] relative">
                <img src={displayFeatures[0].PictureUrl} alt={displayFeatures[0].Title} className="w-full h-full object-cover absolute inset-0" />
                <div className="relative flex items-end justify-start p-4 bg-black/50 w-full h-full group-hover:bg-black/0 transition-all duration-300">
                  <Link to={getFeatureLink(displayFeatures[0])}>
                    <h3 className="text-white text-xl flex items-center gap-2">
                      {displayFeatures[0].Title}
                      <ArrowRightIcon className="size-6" />
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Second Feature */}
          {displayFeatures[1] && (
            <div
              className={`w-full md:w-[calc(50%)] lg:w-2/12 hover:lg:w-3/12 transition-all duration-300 group ${baseAnim} ${animState}`}
              style={{ transitionDelay: "150ms" }}
            >
              <div className="h-[220px] md:h-[350px] relative">
                <img src={displayFeatures[1].PictureUrl} alt={displayFeatures[1].Title} className="w-full h-full object-right absolute inset-0" />
                <div className="relative flex items-end justify-start p-4 bg-black/50 w-full h-full group-hover:bg-black/0 transition-all duration-300">
                  <Link to={`products/filter/${getFeatureLink(displayFeatures[1])}`}>
                    <h3 className="text-white text-xl flex items-center gap-2">
                      {displayFeatures[1].Title}
                      <ArrowRightIcon className="size-6" />
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Third & Fourth Features */}
          <div className={`w-full md:w-12/12 lg:w-4/12 transition-all duration-300 transform ${baseAnim} ${animState}`} style={{ transitionDelay: "300ms" }}>
            <div className="h-[440px] md:h-[350px] relative flex flex-col gap-5">
              {displayFeatures.slice(2, 4).map((item, idx) => (
                <div key={item.Id} className={`h-1/2 md:h-6/12 hover:md:h-full transition-all duration-300 relative group`} style={{ transitionDelay: `${idx * 150}ms` }}>
                  <img src={item.PictureUrl} alt={item.Title} className="w-full h-full object-cover absolute inset-0" />
                  <div className="relative flex items-end justify-start p-4 bg-black/50 w-full h-full group-hover:bg-black/0 transition-all duration-300">
                    <Link to={getFeatureLink(item)}>
                      <h3 className="text-white text-xl flex items-center gap-2">
                        {item.Title}
                        <ArrowRightIcon className="size-6" />
                      </h3>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
