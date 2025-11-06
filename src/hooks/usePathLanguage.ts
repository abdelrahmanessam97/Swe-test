import { getCookie, getLanguageFromPath, setCookie } from "@/utils/pathLanguage";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Path-based Language Management Hook
 *
 * Manages language state consistency between URL paths, cookies, and i18n.
 * Automatically detects language from URL path and synchronizes with cookie storage.
 * Sets appropriate document direction for RTL languages.
 *
 * @hook
 * @example
 * ```tsx
 * function Layout() {
 *   usePathLanguage(); // Initialize language management
 *   return <div>...</div>;
 * }
 * ```
 */
export function usePathLanguage(): void {
  const { i18n } = useTranslation();

  useEffect(() => {
    const pathLang = getLanguageFromPath();
    const cookieLang = getCookie("i18nextLng");

    // If we have a path language, use it and update cookie if needed
    if (pathLang) {
      if (cookieLang !== pathLang) {
        setCookie("i18nextLng", pathLang);
      }

      // Change language if it's different from current
      if (i18n.language !== pathLang) {
        i18n.changeLanguage(pathLang);
      }

      // Set document direction
      document.dir = pathLang === "ar" ? "rtl" : "ltr";
    } else {
      // No path language - set direction based on current language
      document.dir = i18n.language === "ar" ? "rtl" : "ltr";
    }
  }, [i18n]);

  // Also update direction when language changes
  useEffect(() => {
    document.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
}
