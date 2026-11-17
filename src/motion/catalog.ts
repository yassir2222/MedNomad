import { gsap, ScrollTrigger, reduced } from './gsap';
import { VEHICLES, type Vehicle } from '../data/vehicles';

interface InitCatalogArgs {
  root?: HTMLElement | null;
  words?: { setP: (p: number) => void; setOut: (o: number) => void } | null;
  cars?: Vehicle[];
}

export function initCatalog({
  root = document.querySelector('[data-catalog]'),
  words,
  cars = VEHICLES,
}: InitCatalogArgs = {}) {
  if (!root) return null;
  const H = () => window.innerHeight;
  const yC = () => root.offsetTop;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggers: any[] = [];
  const widgets = root.querySelector<HTMLElement>('[data-widgets]');
  const state = { widgetsIn: 0, idx: 0, cars };

  const fields = {
    name: widgets?.querySelector<HTMLElement>('[data-w-name]'),
    desc: widgets?.querySelector<HTMLElement>('[data-w-desc]'),
    price: widgets?.querySelector<HTMLElement>('[data-w-price]'),
    loc: widgets?.querySelector<HTMLElement>('[data-w-loc]'),
    extra: widgets?.querySelector<HTMLElement>('[data-w-extra]'),
  };

  function fill(i: number) {
    const c = cars[i];
    if (!c || !widgets) return;
    state.idx = i;
    if (fields.name) fields.name.textContent = c.name;
    if (fields.desc) fields.desc.textContent = c.desc;
    if (fields.price) fields.price.textContent = c.price;
    if (fields.loc) fields.loc.textContent = c.location;
    if (fields.extra) fields.extra.textContent = `+${c.extra}`;
  }
  fill(0);

  const texts = Object.values(fields).filter((el): el is HTMLElement => Boolean(el));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let swapTl: any = null;
  let pendingIdx = 0;

  function swap(i: number) {
    if (i === pendingIdx) return;
    pendingIdx = i;
    if (reduced) {
      fill(i);
      return;
    }
    swapTl?.kill();
    swapTl = gsap.timeline({ defaults: { ease: 'magic', overwrite: true } });
    swapTl
      .to(texts, { autoAlpha: 0, y: '-.4em', duration: 0.25, stagger: 0.03 })
      .call(() => fill(i))
      .fromTo(
        texts,
        { autoAlpha: 0, y: '.4em' },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, clearProps: 'transform,opacity,visibility' },
      );
  }

  function reset(i = 0) {
    swapTl?.kill();
    gsap.set(texts, { clearProps: 'transform,opacity,visibility' });
    fill(i);
    pendingIdx = i;
  }

  if (reduced) {
    words?.setP(1);
    state.widgetsIn = 1;
    return { triggers, state, fill, swap, reset, widgets, revert: () => {} };
  }

  const items = widgets ? gsap.utils.toArray<HTMLElement>('.widget', widgets) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wtl: any = null;
  if (items.length) {
    wtl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        state.widgetsIn = +wtl.progress().toFixed(3);
      },
    });
    wtl.fromTo(
      items,
      { y: 56, autoAlpha: 0, scale: 0.96, transformOrigin: '50% 100%' },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.85, ease: 'outExpo', stagger: 0.07 },
    );
    triggers.push(
      ScrollTrigger.create({
        start: () => yC() + 1.85 * H(),
        end: () => yC() + 1.85 * H() + 1,
        onEnter: () => wtl.play(),
        onLeaveBack: () => wtl.reverse(),
      }),
    );
  }

  if (words) {
    triggers.push(
      ScrollTrigger.create({
        start: () => yC(),
        end: () => yC() + 1 * H(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpdate: (self: any) => words.setP(self.progress),
      }),
    );
    triggers.push(
      ScrollTrigger.create({
        start: () => yC() + 1 * H(),
        end: () => yC() + 1.4 * H(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpdate: (self: any) => words.setOut(self.progress),
      }),
    );
  }

  return {
    triggers,
    state,
    fill,
    swap,
    reset,
    widgets,
    revert: () => {
      swapTl?.kill();
      wtl?.kill();
      triggers.forEach((t) => t.kill());
    },
  };
}
