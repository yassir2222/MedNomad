import { setVar } from './vars';

const roots = () => Array.from(document.querySelectorAll<HTMLElement>('.pol'));
let cur = 0;

export function setPol(v: number) {
  cur = v;
  roots().forEach((el) => setVar(el, '--pol', v));
}

export const getPol = () => cur;
