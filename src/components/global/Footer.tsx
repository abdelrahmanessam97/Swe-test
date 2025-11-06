import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface MenuItem {
  main: {
    title: string;
    link: string;
  };
  links?: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  menuItems = [
    {
      main: {
        title: "Home",
        link: "/home",
      },
      // links: [
      //   { text: "About", url: "#" },
      //   { text: "Team", url: "#" },
      //   { text: "Blog", url: "#" },
      //   { text: "Careers", url: "#" },
      // ],
    },
    {
      main: {
        title: "Products",
        link: "/products",
      },

      // links: [
      //   { text: "Overview", url: "#" },
      //   { text: "Pricing", url: "#" },
      //   { text: "Marketplace", url: "#" },
      //   { text: "Features", url: "#" },
      // ],
    },

    {
      main: {
        title: "Support",
        link: "/support",
      },
      // links: [
      //   { text: "Help", url: "#" },
      //   { text: "Sales", url: "#" },
      //   { text: "Advertise", url: "#" },
      // ],
    },
    {
      main: {
        title: "About Hub",
        link: "/about_hub",
      },
      // links: [
      //   { text: "Twitter", url: "#" },
      //   { text: "Instagram", url: "#" },
      //   { text: "LinkedIn", url: "#" },
      // ],
    },
  ],
  copyright = "Copyright © 2025 elsewedy | All Rights Reserved ",
}: Footer2Props) => {
  const [visible, setVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.1 });

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={footerRef}
      className={`main-p px-4 !pb-6  bg-[#1D1D1D] text-white transform transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="container">
        <footer>
          <div className="flex flex-col md:flex-row justify-between gap-8 lg:gap-0">
            <div className={`w-full  transform transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              <div className="block mb-2">
                <img src="/footer-logo.png" alt="elsewedy" className="w-[200px]" />
              </div>

              <div className="flex justify-between items-center flex-wrap gap-4">
                <p className="text-white/60 max-w-[350px]">Shop authentic Elsewedy Electric products online, quality and safety guaranteed.</p>

                {/* Menu sections */}
                <div className="flex justify-between gap-3 md:gap-8 ">
                  {menuItems.map((section, idx) => (
                    <div
                      key={idx}
                      className={`transform transition-all duration-700 ease-out delay-${(idx + 1) * 100} ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                      }`}
                    >
                      <Link to={section.main.link} className="font-bold hover:text-primary transition-colors  duration-300">
                        {section.main.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
            className={`flex justify-between  mt-10 flex-col gap-6 border-t border-white/20 pt-8 font-medium md:flex-row md:items-center transform transition-all duration-700 delay-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="flex flex-wrap gap-2">
              <p className="text-white/60">{copyright}</p>
              <div className="flex gap-4">
                <Link to="/terms-and-conditions" className="hover:text-primary transition-colors duration-300 underline" onClick={() => window.scrollTo(0, 0)}>
                  Terms and Conditions
                </Link>
                |
                <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-300 underline" onClick={() => window.scrollTo(0, 0)}>
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div className="flex gap-4 ">
              <a href="https://www.facebook.com/ElsewedyElectric/" target="_blank" className="hover:text-primary transition-colors duration-300">
                <Facebook className="size-6" />
              </a>
              <a href="https://x.com/ElsewedyElec" target="_blank" className="hover:text-primary transition-colors duration-300">
                <Twitter className="size-6" />
              </a>
              <a href="https://www.facebook.com/ElsewedyElectric/" target="_blank" className="hover:text-primary transition-colors duration-300">
                <Instagram className="size-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/https%3A%2F%2Flinkedin.com%2Fcompany%2Felsewedyelectric"
                target="_blank"
                className="hover:text-primary transition-colors duration-300"
              >
                <Linkedin className="size-6" />
              </a>
              <a href="https://www.youtube.com/ElsewedyElectric" target="_blank" className="hover:text-primary transition-colors duration-300">
                <Youtube className="size-6" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
