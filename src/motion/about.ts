import { gsap, ScrollTrigger, reduced } from './gsap';
import { setVar, setClass } from './vars';
import type { BeatConfig } from './beats';

interface InitAboutArgs {
  root?: HTMLElement | null;
  beats: () => BeatConfig;
}

export function initAbout({ root = document.querySelector('[data-about]'), beats }: InitAboutArgs) {
  if (!root) return null;
  const items = gsap.utils.toArray<HTMLElement>('[data-about-in]', root);
  const statement = root.querySelector<HTMLElement>('.about__statement');
  const state = { in: 0, out: 0 };

  if (reduced) {
    items.forEach((el) => setVar(el, '--in', 1));
    return { state, revert: () => {} };
  }

  const H = () => window.innerHeight;
  const yA = () => root.offsetTop;
  const yAe = () => root.offsetTop + root.offsetHeight - H();

  const tIn = ScrollTrigger.create({
    start: () => yA() - (1 - beats().aboutIn[0]) * H(),
    end: () => yA(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (self: any) => {
      state.in = self.progress;
      items.forEach((el) => setVar(el, '--in', self.progress));
    },
  });

  const tOut = ScrollTrigger.create({
    start: () => yAe() - 0.5 * H(),
    end: () => yAe() - 0.1 * H(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (self: any) => {
      state.out = self.progress;
      items.forEach((el) => setVar(el, '--out', self.progress));
      setClass(statement, 'is-anim', self.progress > 0 && self.progress < 1);
    },
  });

  return {
    state,
    revert: () => {
      tIn.kill();
      tOut.kill();
    },
  };
}
