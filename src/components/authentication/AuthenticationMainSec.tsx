import { HandCoins, ScanQrCode, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CardItem = {
  id: number;
  icon: React.ReactElement;
  title: string;
  description: string;
};

const cards: CardItem[] = [
  {
    id: 1,
    icon: <ScanQrCode size={50} color="#C21D0B" />,
    title: "Instant Scan",
    description: "Verify any product in seconds with a simple scan",
  },
  {
    id: 2,
    icon: <HandCoins size={50} color="#C21D0B" />,
    title: "Exclusive Offers",
    description: "Get access to special discounts only available in the app",
  },
  {
    id: 3,
    icon: <ShoppingCart size={50} color="#C21D0B" />,
    title: "Fast Checkout",
    description: "Complete your orders quickly with secure payment options",
  },
  {
    id: 4,
    icon: <Truck size={50} color="#C21D0B" />,
    title: "Track Your Orders",
    description: "Stay updated on your order status anytime, anywhere",
  },
];

const AuthenticationMainSec = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [titleVisible, setTitleVisible] = useState(false);
  const [paraVisible, setParaVisible] = useState(false);

  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");

          if (entry.isIntersecting) {
            if (id === "title") setTitleVisible(true);
            if (id === "para") setParaVisible(true);
            if (id && !isNaN(Number(id))) {
              setVisibleCards((prev) => [...new Set([...prev, Number(id)])]);
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
    <div className="flex flex-col items-center justify-center gap-5 px-4 ">
      {/* Title */}
      <h3
        ref={titleRef}
        data-id="title"
        className={`max-w-[850px] text-3xl md:text-5xl text-center font-bold text-[#3A3A3A] 
          transform transition-all duration-700 ease-out 
          ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        Keep your safety in hand, scan and confirm Elsewedy original wires
      </h3>

      {/* Paragraph */}
      <p
        ref={paraRef}
        data-id="para"
        className={`max-w-[550px] text-center text-[#616161] transform transition-all duration-700 ease-out delay-200
          ${paraVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        Protect your safety and business with Elsewedy Authenticator. Scan, verify, and shop original products with full confidence anytime, anywhere.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {cards.map((item, index) => (
          <div
            key={item.id}
            data-id={item.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            className={`w-[250px] p-6 border border-[#E1E4ED] shadow-[#19213D14] 
              shadow-[0px_8px_24px_0px] rounded-lg flex flex-col items-center 
              justify-center gap-4 text-center transform transition-all duration-700 ease-out 
              ${visibleCards.includes(item.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {item.icon}
            <h4 className="text-[#3A3A3A] text-xl font-bold">{item.title}</h4>
            <p className="text-[#616161] min-h-[70px]">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthenticationMainSec;
