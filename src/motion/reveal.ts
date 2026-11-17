import { gsap } from './gsap';

export function initImageLoad(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('.reveal-image:not([data-load-init])').forEach((box) => {
    box.setAttribute('data-load-init', '');
    const img = box.querySelector('img');
    const loaded = () => box.classList.add('is-loaded');
    if (!img) return loaded();
    if (img.complete && img.naturalWidth > 0) loaded();
    else {
      img.addEventListener('load', loaded, { once: true });
      img.addEventListener('error', loaded, { once: true });
    }
  });
}

export function replay(el: HTMLElement) {
  const had = ['is-inview', 'is-loaded'].filter((c) => el.classList.contains(c));
  el.classList.remove('is-inview');
  el.querySelectorAll('.is-inview').forEach((n) => n.classList.remove('is-inview'));
  void el.offsetWidth;
  gsap.delayedCall(0.05, () => {
    had.forEach((c) => el.classList.add(c));
    el.querySelectorAll('[data-scroll]').forEach((n) => n.classList.add('is-inview'));
  });
}
