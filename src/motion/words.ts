import { SplitText, reduced } from './gsap';
import { setVar, setClass } from './vars';

export function initWords({ root = document.querySelector<HTMLElement>('[data-words]') } = {}) {
  if (!root) return null;
  const state = { p: 0, out: 0, n: 0 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let split: any = null;
  let cancelled = false;

  setClass(root, 'is-hidden', !reduced);

  document.fonts.ready.then(() =>
    requestAnimationFrame(() => {
      if (cancelled) return;
      split = SplitText.create(root, {
        type: 'words',
        wordsClass: 'word',
        propIndex: true,
        autoSplit: false,
      });
      state.n = split.words.length;
      setVar(root, '--n', state.n);
    }),
  );

  const apply = () => {
    setVar(root, '--p', state.p);
    setVar(root, '--out', state.out);
    setClass(root, 'is-words', state.p > 0 && state.p < 1);
    setClass(root, 'is-anim', state.out > 0 && state.out < 1);
    setClass(root, 'is-hidden', state.p <= 0 || state.out >= 1);
  };

  return {
    state,
    root,
    setP(p: number) {
      state.p = p;
      apply();
    },
    setOut(o: number) {
      state.out = o;
      apply();
    },
    revert() {
      cancelled = true;
      split?.revert();
    },
  };
}
