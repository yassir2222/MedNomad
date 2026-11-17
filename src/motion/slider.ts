import { gsap, ScrollTrigger, reduced } from './gsap';
import { getScroll } from './scroll';
import { SLIDER_BY_SCROLL, type BeatConfig } from './beats';

interface InitSliderArgs {
  root?: HTMLElement | null;
  media: {
    N: number;
    state: { zoom: number };
    setCur: (cur: number) => void;
  } | null;
  beats: () => BeatConfig;
  onChange?: (idx: number) => void;
  onReset?: () => void;
}

export function initSlider({
  root = document.querySelector('[data-catalog]'),
  media,
  beats,
  onChange,
  onReset,
}: InitSliderArgs) {
  if (!root || !media) return null;
  const N = media.N;
  const sl = { f: 0, idx: 0, cur: 0, snapping: false, touching: false, active: false, byScroll: SLIDER_BY_SCROLL };
  const H = () => window.innerHeight;
  const stepDist = () => (beats().perCar / 100) * H();
  const start = () => root.offsetTop + 2.2 * H();
  const end = () => start() + (N - 1) * stepDist();
  const expo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const lenis = () => getScroll()?.lenisInstance;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tween: any = null;

  function go(idx: number) {
    if (idx === sl.idx) return;
    sl.idx = idx;
    onChange?.(idx);
    if (reduced) {
      sl.cur = idx;
      media?.setCur(idx);
      return;
    }
    tween = gsap.to(sl, {
      cur: idx,
      duration: 1.6,
      ease: 'magic',
      overwrite: true,
      onUpdate: () => media?.setCur(sl.cur),
    });
  }

  const prevBtn = root.querySelector<HTMLElement>('[data-prev]');
  const nextBtn = root.querySelector<HTMLElement>('[data-next]');

  if (!SLIDER_BY_SCROLL) {
    const stepBy = (dir: number) => {
      if (media.state.zoom < 0.99) return;
      go(Math.max(0, Math.min(N - 1, sl.idx + dir)));
    };
    const onPrev = () => stepBy(-1);
    const onNext = () => stepBy(1);
    prevBtn?.addEventListener('click', onPrev);
    nextBtn?.addEventListener('click', onNext);

    function reset() {
      if (sl.idx === 0 && sl.cur === 0) return;
      tween?.kill();
      sl.idx = 0;
      sl.cur = 0;
      media?.setCur(0);
      onReset?.();
    }

    const resetTrigger = ScrollTrigger.create({
      start: () => root.offsetTop + 1.0 * H(),
      end: () => root.offsetTop + 1.0 * H() + 1,
      invalidateOnRefresh: true,
      onLeaveBack: reset,
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (media.state.zoom < 0.99 || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepBy(1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepBy(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return {
      state: sl,
      trigger: null,
      to: (i: number) => go(Math.max(0, Math.min(N - 1, i))),
      go,
      reset,
      start,
      end,
      step: () => 0,
      get tween() {
        return tween;
      },
      revert: () => {
        tween?.kill();
        resetTrigger.kill();
        prevBtn?.removeEventListener('click', onPrev);
        nextBtn?.removeEventListener('click', onNext);
        window.removeEventListener('keydown', onKeyDown);
      },
    };
  }

  const trigger = ScrollTrigger.create({
    start,
    end,
    invalidateOnRefresh: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onToggle: (self: any) => {
      sl.active = self.isActive;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (self: any) => {
      sl.f = self.progress * (N - 1);
      let idx = sl.idx;
      while (sl.f > idx + 0.58 && idx < N - 1) idx++;
      while (sl.f < idx - 0.58 && idx > 0) idx--;
      go(idx);
    },
  });

  function snap() {
    if (reduced || sl.snapping || sl.touching) return;
    if (!trigger.isActive) return;
    if (Math.abs(sl.f - sl.idx) < 0.002) return;
    const l = lenis();
    if (!l) return;
    sl.snapping = true;
    l.scrollTo(start() + sl.idx * stepDist(), {
      duration: 1.0,
      easing: expo,
      lock: false,
      onComplete: () => {
        sl.snapping = false;
      },
    });
    setTimeout(() => {
      sl.snapping = false;
    }, 1300);
  }

  ScrollTrigger.addEventListener('scrollEnd', snap);
  const onTouchStart = () => {
    sl.touching = true;
  };
  const onTouchEnd = () => {
    sl.touching = false;
  };
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });

  function to(idx: number) {
    const clamped = Math.max(0, Math.min(N - 1, idx));
    const l = lenis();
    if (!l) return;
    l.scrollTo(start() + clamped * stepDist(), { duration: reduced ? 0 : 1.2, easing: expo, lock: false });
  }

  const onPrev = () => to(sl.idx - 1);
  const onNext = () => to(sl.idx + 1);
  prevBtn?.addEventListener('click', onPrev);
  nextBtn?.addEventListener('click', onNext);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!trigger.isActive || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      to(sl.idx + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      to(sl.idx - 1);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  return {
    state: sl,
    trigger,
    to,
    go,
    start,
    end,
    step: stepDist,
    get tween() {
      return tween;
    },
    revert: () => {
      tween?.kill();
      trigger.kill();
      ScrollTrigger.removeEventListener('scrollEnd', snap);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      prevBtn?.removeEventListener('click', onPrev);
      nextBtn?.removeEventListener('click', onNext);
      window.removeEventListener('keydown', onKeyDown);
    },
  };
}
