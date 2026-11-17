import { isMobile } from './gsap';
import { VEHICLES } from '../data/vehicles';

export const N = VEHICLES.length;
export const SLIDER_BY_SCROLL = false;

export interface BeatConfig {
  hold: number;
  aboutExit: number;
  catRun: number;
  perCar: number;
  tail: number;
  videoEnd: number;
  heroOutTitle: number;
  heroOutUi: number;
  g1: number;
  pol: [number, number];
  aboutIn: [number, number];
}

const DESKTOP: BeatConfig = {
  hold: 60,
  aboutExit: 50,
  catRun: 220,
  perCar: 100,
  tail: 0,
  videoEnd: 1.6,
  heroOutTitle: 0.25,
  heroOutUi: 0.18,
  g1: 0.7,
  pol: [0.12, 0.22],
  aboutIn: [0.35, 1],
};

const MOBILE: BeatConfig = {
  ...DESKTOP,
  hold: 40,
  aboutExit: 40,
  catRun: 220,
  perCar: 80,
  videoEnd: 1.4,
};

export function beats(): BeatConfig {
  return isMobile() ? MOBILE : DESKTOP;
}

export function applyBeats(root: HTMLElement = document.documentElement): BeatConfig {
  const b = beats();
  root.style.setProperty('--hold', `${b.hold}svh`);
  root.style.setProperty('--about-exit', `${b.aboutExit}svh`);
  const run = SLIDER_BY_SCROLL ? (N - 1) * b.perCar : 0;
  root.style.setProperty('--cat-run', `calc(${b.catRun}svh + ${run}svh + ${b.tail}svh)`);
  return b;
}
