import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getCookie, getLanguageFromPath, setCookie, SUPPORTED_LANGUAGES } from "./utils/pathLanguage";

import ar from "./locales/ar.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Custom language detector for path + cookie
const pathLanguageDetector = {
  name: "pathDetector",
  lookup() {
    // First try path
    const pathLang = getLanguageFromPath();
    if (pathLang) {
      // Save to cookie when detected from path
      setCookie("i18nextLng", pathLang);
      return pathLang;
    }

    // Fallback to cookie
    const cookieLang = getCookie("i18nextLng");
    if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang)) {
      return cookieLang;
    }

    return "en"; // Default fallback
  },
  cacheUserLanguage(lng) {
    // Only cache in cookies
    setCookie("i18nextLng", lng);
  },
};

i18n
  .use({
    type: "languageDetector",
    async: false,
    detect: pathLanguageDetector.lookup,
    init: () => {},
    cacheUserLanguage: pathLanguageDetector.cacheUserLanguage,
  })
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    // Remove localStorage and navigator detection, use only our custom detector
    detection: {
      order: ["pathDetector"],
      caches: ["pathDetector"],
    },
  });

export default i18n;
