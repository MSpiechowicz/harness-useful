// enhanced-img only declares '*?enhanced'; the hero screenshot adds width and quality directives (components/home/images.ts).
declare module '*&quality=90' {
  import type { Picture } from 'vite-imagetools';

  const value: Picture;
  export default value;
}
