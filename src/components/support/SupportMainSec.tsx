import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SupportMainSec = () => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [paraVisible, setParaVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const items = [
    {
      id: 1,
      icon: <Mail className="text-gray-600" size={36} />,
      label: "Email:",
      value: "info@elsewedy.com",
    },
    {
      id: 2,
      icon: <Phone className="text-gray-600" size={36} />,
      label: "Phone:",
      value: "19159",
    },
    {
      id: 3,
      icon: <Printer className="text-gray-600" size={36} />,
      label: "Fax:",
      value: "(+202) 275 99 731",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");

          if (entry.isIntersecting) {
            if (id === "title") setTitleVisible(true);
            if (id === "para") setParaVisible(true);
            if (id && !isNaN(Number(id))) {
              setVisibleItems((prev) => [...new Set([...prev, Number(id)])]);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (paraRef.current) observer.observe(paraRef.current);
    refs.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-5 items-center justify-center">
      <h3
        ref={titleRef}
        data-id="title"
        className={`max-w-[850px] text-3xl md:text-5xl text-center font-bold text-[#3A3A3A]
        transform transition-all duration-700 ease-out
        ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        How can we help you!
      </h3>

      <p
        ref={paraRef}
        data-id="para"
        className={`max-w-[550px] text-center text-[#616161] transform transition-all duration-700
        ${paraVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        Whether it's for your home, business, or beyond our team is here to support you with answers and expert guidance.
      </p>

      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-6 flex-wrap justify-center">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-4">
            <div
              data-id={item.id}
              ref={(el) => {
                refs.current[index] = el;
              }}
              className={`flex items-center gap-4 p-4
              transform transition-all duration-700 ease-out
              ${visibleItems.includes(item.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="p-2">{item.icon}</div>
              <div className="flex flex-col text-start md:text-left">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-md text-gray-800 font-semibold">{item.value}</span>
              </div>
            </div>

            {index < items.length - 1 && <div className="hidden md:block h-8 w-px bg-gray-200" />}
          </div>
        ))}
      </div>
      <Separator className="my-4" />
    </div>
  );
};

export default SupportMainSec;
