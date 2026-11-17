/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare module '*.css';

declare global {
  interface Window {
    gsap: {
      registerPlugin: (...plugins: any[]) => void;
      parseEase: (ease: string) => (v: number) => number;
      timeline: (vars?: any) => any;
      to: (target: any, vars: any) => any;
      fromTo: (target: any, fromVars: any, toVars: any) => any;
      set: (target: any, vars: any) => any;
      delayedCall: (delay: number, fn: () => void) => any;
      ticker: {
        add: (fn: (time: number) => void) => void;
        remove: (fn: (time: number) => void) => void;
        lagSmoothing: (threshold: number) => void;
      };
      utils: {
        toArray: <T = HTMLElement>(targets: unknown, scope?: unknown) => T[];
      };
    };
    ScrollTrigger: any;
    SplitText: any;
    Flip: any;
    CustomEase: any;
    LocomotiveScroll: any;
    __site?: Record<string, unknown>;
  }
}
