/**
 * Path-based internationalization utilities
 *
 * This module provides utilities for detecting and managing language preferences
 * through URL paths and cookies in a multi-language application.
 *
 * @module pathLanguage
 */

/** Supported language codes */
export const SUPPORTED_LANGUAGES = ["en", "ar", "fr"] as const;

/** Type for supported language codes */
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Extracts the language code from the current URL path
 *
 * @returns The detected language code or null if no language prefix is found
 * @example
 * ```typescript
 * // URL: /en/products
 * getLanguageFromPath() // returns 'en'
 *
 * // URL: /products
 * getLanguageFromPath() // returns null
 * ```
 */
export function getLanguageFromPath(): SupportedLanguage | null {
  if (typeof window === "undefined") return null;

  const pathname = window.location.pathname;
  const pathSegments = pathname.split("/").filter(Boolean);

  // Check if first segment is a supported language
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];
    if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
      return firstSegment as SupportedLanguage;
    }
  }

  return null;
}

/**
 * Removes the language prefix from the current URL path
 *
 * @returns The path without the language prefix
 * @example
 * ```typescript
 * // URL: /en/products/123
 * getPathWithoutLanguage() // returns '/products/123'
 *
 * // URL: /products/123 (no language prefix)
 * getPathWithoutLanguage() // returns '/products/123'
 * ```
 */
export function getPathWithoutLanguage(): string {
  if (typeof window === "undefined") return "";

  const pathname = window.location.pathname;
  const pathSegments = pathname.split("/").filter(Boolean);

  // If first segment is a language, remove it
  if (pathSegments.length > 0 && SUPPORTED_LANGUAGES.includes(pathSegments[0] as SupportedLanguage)) {
    const remainingPath = pathSegments.slice(1).join("/");
    return remainingPath ? `/${remainingPath}` : "/";
  }

  return pathname;
}

/**
 * Builds a complete URL with the specified language prefix
 *
 * @param language - The target language code
 * @returns The complete URL with language prefix
 * @example
 * ```typescript
 * // Current URL: /products/123?search=cable
 * buildLanguageUrl('ar') // returns 'http://localhost:3000/ar/products/123?search=cable'
 * ```
 */
export function buildLanguageUrl(language: SupportedLanguage): string {
  if (typeof window === "undefined") return "";

  const protocol = window.location.protocol;
  const host = window.location.host;
  const pathWithoutLang = getPathWithoutLanguage();
  const search = window.location.search;
  const hash = window.location.hash;

  // Always include language prefix for all languages including English
  return `${protocol}//${host}/${language}${pathWithoutLang}${search}${hash}`;
}

/**
 * Retrieves a cookie value by name
 *
 * @param name - The cookie name
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }
  return null;
}

/**
 * Sets a cookie with the specified name and value
 *
 * @param name - The cookie name
 * @param value - The cookie value
 * @param days - Expiration time in days (default: 365)
 */
export function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Set cookie for the current domain
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}
