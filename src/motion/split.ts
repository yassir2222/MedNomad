import { gsap, ScrollTrigger, SplitText } from './gsap';

let refreshQueued = false;
const queueRefresh = () => {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.refresh();
  });
};

export function initSplit(root: ParentNode = document) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splits: any[] = [];
  let cancelled = false;

  document.fonts.ready.then(() =>
    requestAnimationFrame(() => {
      if (cancelled) return;
      gsap.utils.toArray<HTMLElement>('[data-split]', root).forEach((el) => {
        const { split, splitMask } = el.dataset;
        splits.push(
          new SplitText(el, {
            tag: 'span',
            type: split?.toLowerCase() || 'lines',
            mask: splitMask?.toLowerCase() || 'lines',
            charsClass: 'char',
            wordsClass: 'word',
            linesClass: 'line',
            propIndex: true,
            autoSplit: true,
            onSplit: queueRefresh,
          }),
        );
      });
    }),
  );

  return () => {
    cancelled = true;
    splits.forEach((s) => s.revert());
  };
}
