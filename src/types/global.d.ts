/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

// Environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// i18n module declaration
declare module "@/i18n" {
  import type { i18n } from "i18next";
  const instance: i18n;
  export default instance;
}

// CSS modules
declare module "*.css" {
  const content: any;
  export default content;
}

// Image modules
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}
