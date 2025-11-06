import { useEffect, useRef, useState } from "react";

export default function AppDownload({ firstImage, secondImage, thirdImage }: { firstImage: string; secondImage: string; thirdImage: string }) {
  const [visible, setVisible] = useState(false);
  const mockupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    const currentRef = mockupRef.current; // Create a local variable to hold the current value
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section className="text-black relative  overflow-hidden pt-28 !pb-0 ">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-20 lg:gap-16  ">
          {/* Left Content */}
          <div
            ref={mockupRef}
            className={`space-y-6  mb-6 md:mb-0 lg:space-y-8 order-2 lg:order-1 transform transition-all duration-700 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Main Headings */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <img width={600} height={600} src="/app-home.png" alt="/app-home.png" />
              </div>
            </div>
            {/* <div className="space-y-4 lg:space-y-6">
              <div className="w-[600px] ">
                <h3 className="flex items-center h-15 text-3xl font-light text-[#595959] ">
                  <span className="me-2 font-extrabold text-5xl mb-3 text-[#3A3A3A]">DownLoad</span> Our App
                </h3>
                <h3 className="flex items-center h-15 text-3xl font-light text-[#595959] ">
                  <span className="me-2 font-extrabold text-5xl mb-3 text-[#3A3A3A]">Order</span> All You Need
                </h3>
                <h3 className="flex items-center h-15 text-3xl font-light text-[#595959] ">
                  <span className="me-2 font-extrabold text-5xl mb-3 text-[#3A3A3A]">Scan</span> Your Products
                </h3>
              </div>
            </div> */}

            {/* Download Buttons */}
            <div className="flex  md:flex-row gap-4 mt-8">
              <a
                href="#"
                className={`flex items-center gap-3 transform transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                <img src="/app-store.png" className="w-25 md:w-full " alt="app-store" />
              </a>

              <a
                href="#"
                className={`flex items-center gap-3 transform transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                <img src="/google-play.png" className="w-25 md:w-full" alt="google-play.png" />
              </a>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div
            ref={mockupRef}
            className={`flex justify-center lg:justify-center relative order-2 px-0 gap-8 md:-bottom-5 transform transition-all duration-700 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <img
              src={firstImage}
              alt="app download"
              className={`object-cover w-[300px] transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
            />
            <img
              src={secondImage}
              alt="app download"
              className={`object-cover w-[300px] absolute bottom-0 z-10 transition-all duration-700 delay-400 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            />
            <img
              src={thirdImage}
              alt="app download"
              className={`object-cover w-[300px] transition-all duration-700 delay-600 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            />
          </div>
        </div>
      </div>
      <img src="/dots.png" alt="dots element" className="absolute top-0 -right-20 w-[340px] h-[340px] -z-1" />
    </section>
  );
}
