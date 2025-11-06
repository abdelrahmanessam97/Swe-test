import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { SupportedLanguage } from "@/utils/pathLanguage";
import { buildLanguageUrl, getLanguageFromPath, setCookie, SUPPORTED_LANGUAGES } from "@/utils/pathLanguage";
import { Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

/** Available language configurations */
const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "Arabic", flag: "🇪🇬" },
  { code: "fr", label: "French", flag: "🇫🇷" },
] as const;

export function LangSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get current active language from path first, then fallback to i18n
  const getCurrentLanguage = (): SupportedLanguage => {
    const pathLang = getLanguageFromPath();
    if (pathLang) {
      return pathLang;
    }

    // Fallback to i18n language if no path language detected
    if (SUPPORTED_LANGUAGES.includes(i18n.language as SupportedLanguage)) {
      return i18n.language as SupportedLanguage;
    }

    return "en"; // Default fallback
  };

  const changeLanguage = async (newLang: string, event?: React.MouseEvent) => {
    if (!SUPPORTED_LANGUAGES.includes(newLang as SupportedLanguage)) {
      console.warn(`Unsupported language: ${newLang}`);
      return;
    }

    // Prevent event bubbling to avoid dropdown issues
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const typedLang = newLang as SupportedLanguage;

    // Start enhanced transition animation
    setIsTransitioning(true);
    document.body.style.setProperty("--lang-transition", "true");
    document.body.classList.add("lang-changing");

    // Set cookie first
    setCookie("i18nextLng", typedLang);

    // Update i18n language with a small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 150));

    await i18n.changeLanguage(typedLang);
    document.dir = typedLang === "ar" ? "rtl" : "ltr";

    // Navigate with slight delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 100));

    const newUrl = buildLanguageUrl(typedLang);
    const url = new URL(newUrl);
    navigate(url.pathname + url.search + url.hash);

    // Cleanup with proper timing
    setTimeout(() => {
      setIsTransitioning(false);
      document.body.style.setProperty("--lang-transition", "false");
      document.body.classList.remove("lang-changing");
    }, 200);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="!ring-0 focus:!ring-0 focus:!ring-offset-0" size="icon" aria-label="Language Switcher">
          <Globe
            className={`h-7 w-7 cursor-pointer text-foreground transition-all duration-300 ${isTransitioning ? "text-primary scale-110 animate-pulse" : "scale-100"}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((l) => {
          // Use the improved active language detection
          const currentLang = getCurrentLanguage();
          const isActive = currentLang === l.code;
          return (
            <DropdownMenuItem
              key={l.code}
              onClick={(event) => changeLanguage(l.code, event)}
              className={`flex items-center gap-2 cursor-pointer ${isActive ? "text-primary font-semibold bg-primary/5" : ""}`}
            >
              <span className="text-lg">{l.flag}</span>
              {l.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
