import { gsap, ScrollTrigger } from './gsap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ScrollInstance = any;
type ScrollListener = (e: unknown) => void;

let instance: ScrollInstance = null;
const listeners = new Set<ScrollListener>();
let clickHandler: ((e: MouseEvent) => void) | null = null;

export function initScroll(): ScrollInstance {
  if (instance) return instance;
  instance = new window.LocomotiveScroll({
    lenisOptions: { lerp: 0.07, wheelMultiplier: 0.85, touchMultiplier: 1.3, syncTouch: false },
    initCustomTicker: (render: (time: number) => void) => gsap.ticker.add(render),
    destroyCustomTicker: (render: (time: number) => void) => gsap.ticker.remove(render),
    scrollCallback: (e: unknown) => listeners.forEach((fn) => fn(e)),
  });
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }
  instance.lenisInstance?.on('scroll', ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);

  const isSamePage = (href: string) => {
    if (href.startsWith('#')) return true;
    const u = new URL(href, location.origin);
    return u.pathname === location.pathname && u.hash.length > 0;
  };
  clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const a = target?.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.includes('#')) return;
    const hash = href.slice(href.indexOf('#'));
    if (hash && hash !== '#' && isSamePage(href) && document.querySelector(hash)) {
      e.preventDefault();
      instance?.scrollTo(hash, { duration: 2 });
    }
  };
  document.addEventListener('click', clickHandler);

  if (location.hash) {
    const hash = location.hash;
    requestAnimationFrame(() => instance?.scrollTo(hash, { duration: 2 }));
  }

  return instance;
}

export function destroyScroll() {
  if (clickHandler) {
    document.removeEventListener('click', clickHandler);
    clickHandler = null;
  }
  if (instance) {
    instance.destroy?.();
    instance = null;
  }
  listeners.clear();
}

export const getScroll = () => instance;
export const onScroll = (fn: ScrollListener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
