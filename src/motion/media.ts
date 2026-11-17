import { gsap, ScrollTrigger, reduced } from './gsap';
import { setVar, setClass, clamp01 } from './vars';
import type { BeatConfig } from './beats';

const easeIO = gsap.parseEase('power2.inOut');

interface InitMediaArgs {
  stage?: HTMLElement | null;
  media?: HTMLElement | null;
  about?: HTMLElement | null;
  catalog?: HTMLElement | null;
  slot?: HTMLElement | null;
  heroVideo?: { scrub: (p: number) => void } | null;
  beats: () => BeatConfig;
  onPol?: (v: number) => void;
}

export function initMedia({
  stage = document.querySelector('[data-stage]'),
  media = document.querySelector('[data-media]'),
  about = document.querySelector('[data-about]'),
  catalog = document.querySelector('[data-catalog]'),
  slot = document.querySelector('[data-media-slot]'),
  heroVideo,
  beats,
  onPol,
}: InitMediaArgs) {
  if (!stage || !media) return null;
  const row = stage.querySelector<HTMLElement>('[data-row]');
  const cars = gsap.utils.toArray<HTMLElement>('[data-car]', row);
  const N = cars.length;
  const state = {
    vid: 0,
    g1: 0,
    pol: 0,
    g2: 0,
    dis: 0,
    rin: 0,
    par: 0,
    zoom: 0,
    wind: 0,
    cur: 0,
    curEff: 0,
    slot: null as { x: number; y: number; w: number; h: number } | null,
    y: {} as { H: number; yA: number; yAe: number; yC: number; yCe: number },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tl: any = null;
  let building = false;

  function setCur(cur: number) {
    state.cur = cur;
    const eff = cur * state.wind;
    state.curEff = eff;
    cars.forEach((el, i) => {
      let d = i - eff;
      d -= N * Math.round(d / N);
      const ad = Math.abs(d);
      const vis = 1 - state.zoom * clamp01((ad - 0.5) / 0.4);
      setVar(el, '--d', d);
      setVar(el, '--dir', ad < 0.001 ? 0 : Math.sign(d));
      setVar(el, '--vis', vis);
      setClass(el, 'is-anim', vis > 0 && vis < 1);
      const z = 10 - Math.round(ad);
      const tagged = el as HTMLElement & { __z?: number };
      if (tagged.__z !== z) {
        tagged.__z = z;
        el.style.zIndex = String(z);
      }
      setClass(el, 'is-hidden', vis <= 0 || (i !== 0 && state.rin <= 0));
    });
  }

  const H = () => window.innerHeight;
  const W = () => window.innerWidth;

  function facts() {
    const h = H();
    const yA = about ? about.offsetTop : h;
    const yAe = about ? yA + about.offsetHeight - h : yA;
    const yC = catalog ? catalog.offsetTop : yAe;
    const yCe = catalog ? yC + catalog.offsetHeight - h : yC;
    return { H: h, yA, yAe, yC, yCe };
  }

  function measure() {
    const w = W();
    const h = H();
    const s0 = Math.max(1, h / (0.5625 * w));
    setVar(media, '--s0', s0);
    setVar(media, '--x0', 0, 'px');
    setVar(media, '--y0', 0, 'px');
    let s1 = s0;
    let x1 = 0;
    let y1 = 0;
    let cx1 = 0;
    let cy1 = 0;
    const pin = slot?.parentElement;
    if (slot && pin) {
      const r = slot.getBoundingClientRect();
      const p = pin.getBoundingClientRect();
      const R1 = { x: r.left, y: r.top - p.top, w: r.width, h: r.height };
      s1 = Math.max(R1.w / w, R1.h / (0.5625 * w));
      const pw = w * s1;
      const ph = 0.5625 * w * s1;
      cx1 = ((pw - R1.w) / 2 / pw) * 100;
      cy1 = ((ph - R1.h) / 2 / ph) * 100;
      x1 = R1.x + R1.w / 2 - w / 2;
      y1 = R1.y + R1.h / 2 - h / 2;
      state.slot = R1;
    }
    setVar(media, '--s1', s1);
    setVar(media, '--x1', x1, 'px');
    setVar(media, '--y1', y1, 'px');
    setVar(media, '--cx1', cx1, '%');
    setVar(media, '--cy1', cy1, '%');
    return { s0, s1, x1, y1, cx1, cy1 };
  }

  function build() {
    if (building) return;
    building = true;
    tl?.scrollTrigger?.kill();
    tl?.kill();
    measure();
    const f = facts();
    state.y = f;
    const b = beats();
    if (reduced) {
      building = false;
      return;
    }

    tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => facts().yCe,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const vid = { v: 0 };
    tl.to(vid, { v: 1, duration: b.videoEnd * f.H, onUpdate: () => { state.vid = vid.v; heroVideo?.scrub(vid.v); } }, 0);

    const g1 = { v: 0 };
    tl.to(g1, { v: 1, duration: b.g1 * f.H, onUpdate: () => { const e = easeIO(g1.v); state.g1 = e; setVar(media, '--g1', e); } }, 0);

    const pol = { v: 0 };
    tl.to(pol, { v: 1, duration: (b.pol[1] - b.pol[0]) * f.H, onUpdate: () => { state.pol = pol.v; onPol?.(pol.v); } }, b.pol[0] * f.H);

    const g2 = { v: 0 };
    tl.to(g2, { v: 1, duration: 0.5 * f.H, onUpdate: () => { const e = easeIO(g2.v); state.g2 = e; setVar(media, '--g2', e); } }, f.yAe - 0.1 * f.H);

    const dis = { v: 0 };
    tl.to(
      dis,
      {
        v: 1,
        duration: 0.4 * f.H,
        onUpdate: () => {
          state.dis = dis.v;
          setVar(media, '--dis', dis.v);
          setClass(media, 'is-dissolving', dis.v > 0 && dis.v < 1);
        },
      },
      f.yAe + 0.4 * f.H,
    );

    const rin = { v: 0 };
    tl.to(
      rin,
      {
        v: 1,
        duration: 0.5 * f.H,
        onUpdate: () => {
          state.rin = rin.v;
          setVar(row, '--rin', rin.v);
          setClass(row, 'is-anim', rin.v > 0 && rin.v < 1);
          cars.forEach((el, i) => {
            if (i !== 0) setClass(el, 'is-hidden', rin.v <= 0);
          });
        },
      },
      f.yAe + 0.5 * f.H,
    );

    const par = { v: 0 };
    tl.to(par, { v: 1, duration: 1.4 * f.H, onUpdate: () => { state.par = par.v; setVar(row, '--par', par.v); } }, f.yC);

    const wind = { v: 0 };
    tl.to(wind, { v: 1, duration: 1.0 * f.H, onUpdate: () => { state.wind = easeIO(wind.v); setCur(state.cur); } }, f.yC + 1.0 * f.H);

    const zoom = { v: 0 };
    tl.to(
      zoom,
      {
        v: 1,
        duration: 0.8 * f.H,
        onUpdate: () => {
          const e = easeIO(zoom.v);
          state.zoom = e;
          setVar(row, '--zoom', e);
          setCur(state.cur);
        },
      },
      f.yC + 1.2 * f.H,
    );

    tl.to({}, { duration: 0.001 }, f.yCe);
    building = false;
  }

  ScrollTrigger.addEventListener('refreshInit', build);
  setCur(0);
  build();

  return {
    state,
    media,
    cars,
    N,
    facts,
    setCur,
    get timeline() {
      return tl;
    },
    rebuild: build,
    revert: () => {
      ScrollTrigger.removeEventListener('refreshInit', build);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    },
  };
}
