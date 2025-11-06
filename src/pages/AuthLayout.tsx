import AuthFooter from "@/components/auth/AuthFooter";
import { usePathLanguage } from "@/hooks/usePathLanguage";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  // Initialize path-based language handling
  usePathLanguage();

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Listen for language transition changes
    const checkTransition = () => {
      const isTransition = document.body.style.getPropertyValue("--lang-transition") === "true";
      setIsTransitioning(isTransition);
    };

    // Check initially
    checkTransition();

    // Create observer for style changes
    const observer = new MutationObserver(checkTransition);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={`transition-all duration-300 ease-in-out ${isTransitioning ? "opacity-80 scale-[0.99] -translate-y-1" : "opacity-100 scale-100 translate-y-0"}`}>
        <main className={`transition-all duration-300 ease-in-out ${isTransitioning ? "opacity-60 blur-[1px]" : "opacity-100 blur-0"}`}>
          <div className={`transition-all duration-400 ease-out ${!isTransitioning ? "animate-fadeInUp" : ""}`}>
            <Outlet />
          </div>
        </main>
        <AuthFooter />
      </div>

      {/* Enhanced transition overlay */}
      <div
        className={`fixed inset-0 z-[9998] pointer-events-none transition-all duration-300 ease-in-out ${
          isTransitioning ? "opacity-100 visible backdrop-blur-[2px] bg-gradient-to-br from-black/10 via-black/15 to-black/10" : "opacity-0 invisible backdrop-blur-0"
        }`}
      >
        {/* Animated shimmer effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transition-transform duration-700 ${
            isTransitioning ? "translate-x-full" : "-translate-x-full"
          }`}
        />
      </div>
    </>
  );
};

export default AuthLayout;
