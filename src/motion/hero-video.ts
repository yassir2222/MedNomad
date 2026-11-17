import { reduced } from './gsap';

export function initHeroVideo(video: HTMLVideoElement | null = document.querySelector('[data-hero-video]')) {
  if (!video) {
    return {
      scrub: (_p01: number) => {},
      ready: Promise.resolve(),
      video: null as HTMLVideoElement | null,
      onFrame: (_fn: (v: HTMLVideoElement) => void) => () => {},
      seeking: false,
      revert: () => {},
    };
  }

  let pending: number | null = null;
  let seeking = false;
  let destroyed = false;
  const frameListeners = new Set<(v: HTMLVideoElement) => void>();

  const applyNext = () => {
    if (destroyed) return;
    frameListeners.forEach((fn) => fn(video));
    if (pending === null) {
      seeking = false;
      return;
    }
    const t = pending;
    pending = null;
    if (Math.abs(video.currentTime - t) < 0.01) {
      seeking = false;
      return;
    }
    seeking = true;
    try {
      video.currentTime = t;
    } catch {
      seeking = false;
    }
  };

  video.addEventListener('seeked', applyNext);

  const scrub = (p01: number) => {
    if (reduced || destroyed) return;
    const d = video.duration;
    if (!d || video.readyState < 1) return;
    if (!video.paused) video.pause();
    const target = Math.min(d - 0.001, Math.max(0, p01 * d));
    if (!seeking && Math.abs(video.currentTime - target) < 0.03) return;
    pending = target;
    if (!seeking) applyNext();
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  const ready = new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        resolve();
      }
    };
    const onMeta = () => {
      video.pause();
      try {
        video.currentTime = 0.001;
      } catch {
        // ignore seek error before decode
      }
    };
    const onCanPlay = () => {
      const warm = Math.min(0.12, (video.duration || 4) * 0.03);
      const back = () => {
        video.removeEventListener('seeked', back);
        try {
          video.currentTime = 0.001;
        } catch {
          // ignore
        }
        finish();
      };
      video.addEventListener('seeked', back, { once: true });
      try {
        video.currentTime = warm;
      } catch {
        finish();
      }
    };
    if (video.readyState >= 1) onMeta();
    else video.addEventListener('loadedmetadata', onMeta, { once: true });
    if (video.readyState >= 3) onCanPlay();
    else video.addEventListener('canplay', onCanPlay, { once: true });
    video.addEventListener('error', finish, { once: true });
    timer = setTimeout(finish, 4000);
  });

  const onFrame = (fn: (v: HTMLVideoElement) => void) => {
    frameListeners.add(fn);
    return () => frameListeners.delete(fn);
  };

  return {
    scrub,
    ready,
    video,
    onFrame,
    get seeking() {
      return seeking;
    },
    revert: () => {
      destroyed = true;
      if (timer) clearTimeout(timer);
      video.removeEventListener('seeked', applyNext);
      frameListeners.clear();
    },
  };
}
