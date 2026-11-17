const { gsap, ScrollTrigger, SplitText, Flip, CustomEase } = window;

if (!gsap) throw new Error('gsap missing — check the CDN <script> order in index.html');
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase);

CustomEase.create('magic',   '0.33, 0, 0, 1');
CustomEase.create('quart',   '0.41, 0.35, 0.2, 1');
CustomEase.create('outExpo', '0.19, 1, 0.22, 1');
CustomEase.create('base',    '0.46, 0.03, 0.12, 1');
CustomEase.create('expoOut', '0.16, 1, 0.3, 1');

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isMobile = () => matchMedia('(max-width: 767px)').matches;

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase };
