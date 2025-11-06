import { Info, LockKeyhole, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const highlights = [
  { icon: RotateCcw, text: "15 Days Returnable" },
  { icon: ShieldCheck, text: "3 years warranty" },
  { icon: Truck, text: "Delivered in 5 days" },
  { icon: LockKeyhole, text: "Secure transaction" },
];

const ProductHighlights = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div ref={sectionRef} className={`space-y-3 transform transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
      {/* Header banner */}
      <div
        className={`bg-[#F8F8F8] flex items-center flex-wrap gap-3 p-4 px-5 transition-all duration-700 delay-150 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <img src="/product-highlight.png" className="w-20" alt="product-highlight" />
        <span>
          <p className="text-sm text-[#3A3A3A]">
            Pay later on instalments up to <span className="text-[#FF5506]">60 months</span>
          </p>
        </span>
      </div>

      {/* Highlight items */}
      {highlights.map((item, i) => (
        <div
          key={i}
          className={`flex items-center justify-between py-4 px-5 border-b border-[#0000001A] gap-3 text-sm text-[#272727] font-medium transition-all duration-700 delay-${
            i * 100 + 200
          } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center gap-2">
            <item.icon className="w-6 h-6 text-primary" />
            <span>{item.text}</span>
          </div>
          <Info color="#7D7D7D" width={18} height={18} />
        </div>
      ))}
    </div>
  );
};

export default ProductHighlights;
