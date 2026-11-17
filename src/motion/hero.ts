import { gsap, ScrollTrigger, reduced } from './gsap';
import { setVar, setClass } from './vars';
import type { BeatConfig } from './beats';

interface InitHeroArgs {
  root?: HTMLElement | null;
  header?: { root: HTMLElement; playIntro: () => unknown } | null;
  beats: () => BeatConfig;
  ready?: Promise<void>;
}

export function initHero({
  root = document.querySelector('[data-hero]'),
  header = null,
  beats,
  ready = Promise.resolve(),
}: InitHeroArgs) {
  if (!root) return null;
  const title = root.querySelector<HTMLElement>('[data-hero-title]');
  const ui = gsap.utils.toArray<HTMLElement>('[data-hero-ui]', root);
  const all = [title, ...ui].filter((el): el is HTMLElement => Boolean(el));
  const chrome = [header?.root, root].filter((el): el is HTMLElement => Boolean(el));
  const state = { outTitle: 0, outUi: 0, introRunning: false };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let intro: any = null;
  let started = false;
  let reverted = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggers: any[] = [];

  const show = () => gsap.set(chrome, { visibility: 'visible' });
  const H = () => window.innerHeight;

  const ghost = header?.root?.querySelector<HTMLElement>('.header__ghost');
  function alignTitle() {
    if (!ghost || !root) return;
    const r = ghost.getBoundingClientRect();
    if (r.width > 0) root.style.setProperty('--title-left', `${Math.round(r.left)}px`);
    else root.style.removeProperty('--title-left');
  }
  document.fonts.ready.then(() => {
    if (!reverted) alignTitle();
  });
  alignTitle();
  ScrollTrigger.addEventListener('refreshInit', alignTitle);

  const gate = (el: HTMLElement | null, out: number) =>
    setClass(el, 'is-anim', state.introRunning || (el === title && out > 0 && out < 1));

  function buildScrub() {
    if (reduced || reverted) return;
    if (title) {
      triggers.push(
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => `+=${beats().heroOutTitle * H()}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onUpdate: (self: any) => {
            state.outTitle = self.progress;
            setVar(title, '--out', self.progress);
            gate(title, self.progress);
          },
        }),
      );
    }
    triggers.push(
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${beats().heroOutUi * H()}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpdate: (self: any) => {
          state.outUi = self.progress;
          ui.forEach((el) => {
            setVar(el, '--out', self.progress);
            gate(el, self.progress);
          });
        },
      }),
    );
  }

  function start() {
    if (started || reverted) return;
    started = true;
    if (reduced) {
      all.forEach((el) => setVar(el, '--in', 1));
      show();
      return;
    }

    state.introRunning = true;
    all.forEach((el) => {
      setVar(el, '--in', 0);
      setClass(el, 'is-anim', true);
    });
    header?.playIntro();
    const tIn = { v: 0 };
    const uIn = ui.map(() => ({ v: 0 }));
    intro = gsap.timeline({
      onComplete: () => {
        state.introRunning = false;
        gate(title, state.outTitle);
        ui.forEach((el) => gate(el, state.outUi));
      },
    });
    if (title) {
      intro.to(tIn, { v: 1, duration: 1.4, ease: 'outExpo', onUpdate: () => setVar(title, '--in', tIn.v) }, 0.15);
    }
    ui.forEach((el, i) =>
      intro.to(uIn[i], { v: 1, duration: 0.9, ease: 'expoOut', onUpdate: () => setVar(el, '--in', uIn[i].v) }, 0.45 + i * 0.09),
    );
    show();
    buildScrub();
  }

  Promise.all([document.fonts.ready, ready]).then(() => requestAnimationFrame(start));
  let failsafe: ReturnType<typeof setTimeout> | undefined;
  const arm = () => {
    failsafe = setTimeout(() => {
      if (started || reverted) return;
      if (document.hidden) {
        arm();
        return;
      }
      started = true;
      all.forEach((el) => setVar(el, '--in', 1));
      show();
    }, 4000);
  };
  arm();

  return {
    state,
    get intro() {
      return intro;
    },
    replay() {
      if (!intro) return;
      header?.playIntro();
      all.forEach((el) => setClass(el, 'is-anim', true));
      state.introRunning = true;
      intro.restart();
    },
    revert() {
      reverted = true;
      if (failsafe) clearTimeout(failsafe);
      ScrollTrigger.removeEventListener('refreshInit', alignTitle);
      intro?.kill();
      triggers.forEach((t) => t.kill());
    },
  };
}
