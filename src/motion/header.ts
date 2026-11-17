import { gsap, reduced } from './gsap';

export function initHeader(root: HTMLElement | null = document.querySelector('[data-header]')) {
  if (!root) return null;
  const items = gsap.utils.toArray<HTMLElement>('[data-header-item]', root);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let entrance: any = null;

  function playIntro() {
    if (reduced) return null;
    gsap.set(items, { transition: 'none' });
    entrance = gsap.fromTo(
      items,
      { y: '1em', autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: 'magic',
        stagger: 0.08,
        clearProps: 'transform,opacity,visibility',
        onComplete: () => {
          entrance = null;
          gsap.set(items, { clearProps: 'transition' });
        },
      },
    );
    return entrance;
  }

  function settleIntro() {
    if (!entrance) return;
    entrance.kill();
    entrance = null;
    gsap.set(items, { clearProps: 'transition,transform,opacity,visibility' });
  }

  return {
    root,
    items,
    playIntro,
    settleIntro,
    revert: () => {
      entrance?.kill();
      gsap.set(items, { clearProps: 'transition,transform,opacity,visibility' });
    },
  };
}
