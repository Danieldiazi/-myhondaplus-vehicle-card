/// <reference types="vite/client" />

declare const __CARD_VERSION__: string;

declare module "*.svg?raw" {
  const content: string;
  export default content;
}
