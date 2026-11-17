export function initMarquee({
  root = document.querySelector<HTMLElement>('[data-marquee]'),
  speed = 40,
}: { root?: HTMLElement | null; speed?: number } = {}) {
  if (!root) return null;
  const track = root.querySelector<HTMLElement>('.marquee__track');
  if (!track || track.dataset.cloned) return null;

  const clones = Array.from(track.children, (n) => {
    const clone = n.cloneNode(true) as HTMLElement;
    clone.setAttribute('data-marquee-clone', '1');
    return clone;
  });
  track.append(...clones);
  track.dataset.cloned = '1';

  let cancelled = false;
  const measure = () => {
    if (cancelled) return;
    const half = track.scrollWidth / 2;
    root.style.setProperty('--marquee-dur', `${(half / speed).toFixed(2)}s`);
  };
  document.fonts.ready.then(measure);
  measure();

  let timer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    clearTimeout(timer);
    timer = setTimeout(measure, 150);
  };
  window.addEventListener('resize', onResize);

  return {
    root,
    track,
    measure,
    revert: () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      clones.forEach((c) => c.remove());
      delete track.dataset.cloned;
    },
  };
}
