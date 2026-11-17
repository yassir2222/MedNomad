export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const segT = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

interface MotionElement extends HTMLElement {
  __vars?: Record<string, string>;
  __cls?: Record<string, boolean>;
}

export function setVar(el: HTMLElement | null | undefined, name: string, v: number, unit = '') {
  if (!el) return;
  const target = el as MotionElement;
  const s = (+v).toFixed(3) + unit;
  const memo = target.__vars || (target.__vars = {});
  if (memo[name] === s) return;
  memo[name] = s;
  target.style.setProperty(name, s);
}

export function setClass(el: HTMLElement | null | undefined, cls: string, on: boolean) {
  if (!el) return;
  const target = el as MotionElement;
  const memo = target.__cls || (target.__cls = {});
  if (memo[cls] === on) return;
  memo[cls] = on;
  target.classList.toggle(cls, on);
}
