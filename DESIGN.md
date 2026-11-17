# new-14 · Ostro — Design system

Source of truth for the site. Tokens live in `style.css @layer tokens`, type roles as `.t-*` in `@layer components`,
motion rules in `@layer motion`, choreography in `lib/*.js`. Beat windows in one table: `lib/beats.js`.

**Where from.** Typography — jonhowell.com (KH Teka 400/500, commercial → Inter Tight, the house face).
Hero shrink + logo marquee — sensei.tech. Word-by-word blur reveal — animos.app. Catalog/slider — damso.com
(slowed: 1.2s outExpo instead of .8s expo.out with overshoot). Video → cut-out landing — new-9; polarity — new-9;
stack, scrubber, reveal contract — new-12/new-13-v2.

---

## 0. In one paragraph

A white page from the first pixel; the hero's black is the clip itself, full-bleed. The header is the only thing that
flips (white over the clip, black over the page) — by one scalar, in one quick beat. One face, Inter Tight, two weights:
500 carries display, statements and every clickable thing; 400 carries reading text. Tracking is never positive.
No eyebrows, no caps, no mono, no strokes, no shadows: fills, glass and a white-alpha ladder. The clip is scrubbed by
scroll, never played; it shrinks into a column, then its last frame dissolves into a cut-out car that becomes the
catalogue. Everything appears through blur and settles with expo-out; everything by scroll tracks the finger raw.

## 1. Typeface

**Inter Tight** 400 + 500, self-hosted (`fonts/inter-tight.css`, latin + latin-ext). Metric fallback from Arial
(`ascent 96.88% / descent 24.15%`). Stack: `'Inter Tight', 'Inter Tight Fallback', -apple-system, …`.

| token | weight | where |
|---|---|---|
| `--w-ui` | 500 | display, statement, price, nav, buttons, pills, captions |
| `--w-text` | 400 | body, descriptions, small notes |

## 2. Scale (jonhowell.com → rem on the new-12 fluid root)

Root: `15px` → ≥640 `clamp(15px, 12.9574px + .3191vw, 18px)` → ≥1580 `clamp(18px, 1.1765vw − .5882px, 22px)`
(@390 15 · @1024 16.2 · @1440 17.55 · @1920 22).

| role | class | rem (mobile → md) | @1440 px | lh | tracking | weight | where |
|---|---|---|---|---|---|---|---|
| Display | `.t-display` | 2.75 → 4.5 | 79 | .95 | −.04em | 500 | «Premium» (ink 40%) / «Car Rental» |
| Statement | `.t-statement` | 1.75 → 2.5 | 44 | 1.15 | −.03em | 500 | screen 2 (4 lines), screen 3 words, car name |
| Price | `.t-price` | 1.5 | 26 | 1 | −.02em | 500, tabular | «$300» |
| Body | `.t-body` | 1.125 | 20 | 1.3 | 0 | 400 | hero description, car description |
| Body-sm | `.t-body-sm` | .9375 | 16.5 | 1.25 | 0 | 400 | «Day», notes |
| UI | `.t-ui` | 1 | 17.5 | 1 | −.01em | 500 | nav, buttons, «Scroll», «All specifications» |
| Caption | `.t-caption` | .875 | 15 | 1.2 | 0 | 500 | pills «New York» «+3», marquee wordmarks |

Rules: tracking tightens with size (−.04 → −.03 → −.02 → −.01 → 0), never positive; line-height ≤ 1 on display,
1.15 on statements, 1.3 on reading text; jumps between tiers ≥ ×1.4; one face, no eyebrows/caps/mono/brackets/numbering.

## 3. Colour · polarity · form

Two colours, `--k #000` and `--w #fff`, plus `--soft #f1f1f1` for the light cards. The page is **always white with black
ink** (`:root` static `--ink #000 / --plate #fff` + ladder). The **header** alone carries `.pol` and re-derives the same
names from one scalar; the hero chrome is hard white (it only ever sits on the clip):

```
--ink   = color-mix(in srgb, --w, --k  pol%)      text, solid buttons, icons
--plate = color-mix(in srgb, --k, --w  pol%)      page and scene ground, solid-button label
--ink-55 / -40 / -20 / -10 / -06                  the alpha ladder (secondary text, ghost display, hairlines, glass)
--glass = ink 8% (+ backdrop blur 12px), hover 14%
```
`--pol` is declared on the element, never `:root` (an unregistered property substitutes where declared). JS writes it
(`lib/pol.js`) over `[.12H, .22H]` — the plate's top edge is at `195·g1 px`, so this is exactly the moment it slides out
from under the header's text; a short window reads as a decisive flip, not a fade.

Form: `--radius .75rem` (buttons, pills 999px), `--radius-card 1.5rem` (screen-4 widgets), `corner-shape: squircle`
under `@supports`, `--btn-h 2.75rem`. No strokes, no shadows. Buttons: `.btn--ink` (solid, inverts with --pol),
`.btn--soft` (light grey on the white screens), `.btn--glass`. `.pill` — glass label with a Bootstrap icon.

## 4. Composition (screen 1)

```
header.header.pol (fixed)   logo «Ostro» · [Scroll · Cars · Partners · Rental] · a.btn--ink «Rental»
section.hero (100lvh, over the sticky scene)
  .hero__side   left, vertically centred: .pill «◉ New York» + p.t-body (2 lines, max 19em)
  .hero__hint   bottom-left: «Scroll ↓»
  h1.hero__title bottom: «Premium» (white 40%) starts on the header's «Scroll» x (measured → --title-left); «Car / Rental» ends at the right margin
```
The scene under it (`.stage__scene`, sticky 100lvh, margin-bottom −100lvh) holds the media plate: `.car.media`
= 100vw × 56.25vw centred, `scale s0 = max(1, H/(.5625·W))` → cover. `<video>` and the cut-out fill the same box
(`inset 0`, `object-fit: cover`, 16:9 intrinsic) → the cut-out lands on the last frame by construction.

## 5. Motion vocabulary

| ease | curve | where |
|---|---|---|
| `magic` | `.33, 0, 0, 1` | UI entrances, hovers, widget text swap |
| `outExpo` | `.19, 1, .22, 1` | display reveals, slider transition |
| `expoOut` | `.16, 1, .3, 1` | blur reveals (house default) |
| `quart` | `.41, .35, .2, 1` | images |
| scrub | `none` | everything driven by scroll — type tracks the finger |

Durations .3 tap · .6 UI · .9 blur-reveal · 1.2 image · 1.4 display · 1.6 words; staggers 50–90ms.

**Contract.** JS writes 0→1 custom properties on the element (3dp, skip-if-unchanged — `lib/vars.js`); CSS derives
opacity / translate / transform. Timed and scrubbed halves are separate properties (`--in` / `--out`) that meet only in
CSS. Blur exists only under a state class (`.is-anim`, `.is-dissolving`) toggled once per crossing — a permanent
`blur(0)` holds a render surface.

### H1 · Page intro (`lib/hero.js`, after `fonts.ready ∧ heroVideo.ready`, failsafe 4s)
```
0     header items   y 1em → 0 + fade                .6s magic, stagger .08     (lib/header.js)
.15   title  --in    blur 14px → 0, y .2em → 0, fade  1.4s outExpo
.45   pill · desc · hint --in   blur 8px → 0, y 1.25rem → 0, fade   .9s expoOut, stagger .09
```
### H2 · Hero exit (scrub, `lib/hero.js`)
title `--out` over `[0, .25H]`: opacity 1→0, y → −4svh, blur 0→16px · small UI `--out` over `[0, .18H]`: opacity, y → −1em.
Short on purpose: the plate's bottom edge rises at `303·g1 px`, and white type must be gone before the white page shows under it.
### H3 · Clip scrub (`lib/media.js` + `lib/hero-video.js`)
`[0, 1.6H]` → `currentTime .001 → d − .001`; seek-coalesced (one in flight, 30ms dead zone); holds the last frame after.

### H4 · Shrink into the slot (`lib/media.js`, g1 over `[0, .7H]`)
The plate goes from cover (`s0 = max(1, H/(.5625W))`) to the measured slot of `#about` (col 1–6, top 20.4svh,
height 47.9svh): `s1 = max(slot.w/W, slot.h/(.5625W))`, translate to the slot centre, the overhang clipped with
`clip-path: inset(cy1 cx1)` (`cx1 = (W·s1 − slot.w)/2/(W·s1)`). @1470×956: s0 1.156 → s1 .554, x1 −357px, y1 −54px,
cx1 7.5%. Measured pin-relative on every refresh, so it lands within .3px at any viewport.

### H5 · Header polarity (`lib/pol.js`, `[.12H, .22H]`)
`--pol 0 → 1` on the header only: ink white → black, the CTA inverts. The page never changes colour.

### H6 · Screen 2 in / hold / out (`lib/about.js`)
`--in` over `[yA − .65H, yA]`: statement lines rise out of their masks one after another
(`--li = clamp((in·1.5 − (line−1)·.14))`, 1.15em travel), button and marquee rise 14svh with a fade. Hold `[1H, 1.6H]`
(the clip finishes its last third meanwhile). `--out` over `[yAe − .5H, yAe − .1H]`: statement fades + lifts 2rem +
blur 0→10px (`.is-anim`), button lifts 1.5rem, marquee drops 1.5rem. Marquee: CSS `translateX 0 → −50%` on a ×2 track
at 40px/s, masked edges, plays only while `.is-inview`.

### H7 · Glide → dissolve → row (`lib/media.js`)
- **g2** `[yAe − .1H, yAe + .4H]`: the plate leaves the slot for the centre of the row — `s1 → s2 = .335` (card 33.5vw),
  translate to (0, +11.7svh), the slot clip re-opens (`--gc = g1·(1 − g2)`). The clip holds its last frame; no seek is in flight.
- **dis** `[yAe + .4H, yAe + .8H]`: `.media__video` opacity 1→0 + blur 0→24px, `.media__cut` opacity 0→1 + blur 12→0px,
  both only under `.is-dissolving`. The box does not move in this window (verified: identical rect at 2.5 / 2.7 / 2.9H), so the
  cut-out lands on the frame by construction.
- **rin** `[yAe + .5H, yC]`: cars 1..4 (same box rules, `--d` = wrapped distance from car 0 via `setCur`) come in from
  `dir·12vw` outside their rest and 6svh below it, opacity 0→1, blur 12→0px (`.row.is-anim`); rest pitch 28.57vw (420px @1470).
  The row lands at `--row-dy 44svh` — the car bodies sit ON the bottom edge (body bottom ≈ viewport bottom; the box runs
  past the edge, the scene clips it). The glide and the dissolve happen there too.
- **par** `[yC, yC + 1.4H]`: the whole row rises `--par-dy 46svh` steadily through the words' assembly AND their fade
  (x breathes ±1.5vw·d). The bodies reach the statement's last line at par ≈ .65 = p ≈ .9 — on the last two words — and cover
  it (~30px at p = 1) while it fades (H8 out, `[yC+1H, yC+1.4H]`). The words live in the scene UNDER the row.
- **x is mirrored** in the chain (`− d·pitch`): a positive `d` sits on the left. That is what makes the slider drive forward.

### H8 · Words (`lib/words.js` + `lib/catalog.js`)
`[data-words]` (statement role, centred, 41.5vw, top 47svh) split into words (`--word`), `--n` = count. `--p` over
`[yC, yC + 1H]`: word i owns `[(i−1), (i+1)]` of `p·(n+1)` — `--w = clamp((p·(n+1) − (i−1)) / 2)`; opacity .12 + .88·w,
translate y (1−w)·.35em, blur (1−w)·8px under `.is-words`. No transition — it tracks the finger. `--out` over
`[yC + 1H, yC + 1.4H]`: block opacity 1→0, lift 16px, blur 0→10px under `.is-anim`; `.is-hidden` outside its life.

### H9 · Zoom into the card (`lib/media.js`, `--zoom` over `[yC + 1.2H, yC + 2H]`)
Every card's scale goes `s2 → 1` (the centre car spans the full 100vw plate — the car itself ≈ 240–1230px @1470 with the
placeholder's 69% frame fraction) and the pitch opens `28.57vw → 100vw + 4rem` (the slider spacing). `setCur` re-derives
`--vis = 1 − zoom·clamp((|d| − .35) / .4)` for the neighbours → opacity, blur (1−vis)·16px (`.is-anim` per card), scale
×(.92 + .08·vis), `.is-hidden` at 0. The centre car ends at cy = 50svh + `--full-dy 44svh` − `--par-dy 46svh` ≈ 459 (mock 460);
the zoom overlaps the tail of the rise (1.2–1.4H) with no seam — the y chain is additive.

### H10 · Widgets (`lib/catalog.js`, `--in` over `[yC + 1.7H, yC + 2.2H]`)
Five cards on `--soft` (#f1f1f1, radius 1.5rem), 180px tall, gap 10px: ‹ 90 · main (name `.t-statement` + desc + «All
specifications») · location 156 (pills) · price 160 («Day», `.t-price`, «Rental» `.btn--ink`) · › 90 — mock geometry to the
pixel. Each rises 140% → 0 with a fade on its own window `--wi = clamp((in − i·.12) / .52)` (i = 0..4), reversible.
Copy comes from `#cars` (JSON, one entry per card in `.row`); `fill(i)` writes name/desc/price/location/+extra.

### H11 · Slider (`lib/slider.js`)
**Current mode: arrows / ← → only** (`SLIDER_BY_SCROLL = false` in `lib/beats.js`; Dmitriy, 2026-09-15 — switching by
scroll felt awkward). The page ends with the widgets parked (`--cat-run = 240 + 20 svh`); ‹ › and the keys (once the card is
on screen, zoom ≥ .99) call `go(idx)` directly — the same 1.2s outExpo tween + text swap. The page ends exactly where the
widgets park (`--cat-run 220svh`, no tail), so the sticky screen never unsticks — the card and its widgets stay glued to the
bottom as the last frame of the site (more content may follow later). Flip the flag to restore the scroll runway below. The media box (car 0) leaves like any other card: `opacity: var(--vis)`, blur under `.is-anim`, `.is-hidden` at 0.

*Scroll mode (flag on):* scroll picks the **car**, not the position: `f = progress·(N−1)` becomes an integer `idx` with hysteresis (a change
needs `|f − idx| > .58`, so a wobble never flips it back). Each change is **one timed tween** of `cur` — `1.2s outExpo`,
no overshoot (damso: .8s expo.out with 1.08 overshoot) — that `media.setCur(cur)` turns into every card's `--d / --vis`:
the outgoing car drives **out to the right** (`−d·72vw`, d → −1) with opacity 1→0 over |d| .35→.75, blur 0→16px, scale ×.92;
the incoming enters from the left — «›» reads as the car moving forward.
The cards are never scrubbed — one writer; reverse crosses the same thresholds backwards and the same tween runs back.
**Snap** — on ScrollTrigger `scrollEnd`, inside the window and off a rest point, `lenis.scrollTo(start + idx·H, 1.0s expo,
lock:false)` (a new wheel flick simply takes over; no snap while touching). Arrows ‹ › and ← → keys call the same
`scrollTo` to the neighbour's rest point, so the threshold + tween + swap path is identical to a wheel step.
**Widget swap** (`lib/catalog.js swap(i)`): the five text fields drop `.25s magic` (−.4em, fade, 30ms apart) → new copy →
rise `.4s magic` (40ms apart); inner spans only, the `.widget` shells keep their scroll-driven translate. Reduced motion:
integer `setCur`, no snap, instant text.

## 6. Beats (`lib/beats.js`, H = 100svh, desktop)

| beat | window | owner |
|---|---|---|
| hero out | [0, .45H] title · [0, .30H] UI | hero.js |
| clip scrub | [0, 1.6H] | media.js |
| shrink g1 · polarity · about in | [0, .7H] · [.2H, .55H] · [.35H, 1H] | media.js · pol.js · about.js |
| hold | [1H, 1.6H] | — |
| about out | [1.6H, 2H] | about.js |
| glide g2 · dissolve · row in | [2H, 2.5H] · [2.5H, 2.9H] · [2.6H, 3.1H] | media.js |
| words · rise · words out | [3.1H, 4.1H] · rise [3.1H, 4.5H] · [4.1H, 4.5H] | catalog.js + words.js · media.js |
| zoom · widgets | [4.3H, 5.1H] · [4.8H, 5.3H] | media.js · catalog.js |
| slider | arrows only; page ends at 5.3H (scroll mode: [5.3H, 5.3H + (N−1)·H]) | slider.js |

Section heights come from the same table: about = `100svh + --hold 60 + --about-exit 50`, catalog =
`100svh + 240 + (N−1)·100 + 20 svh`.

## 7. Verification

`__site.drive(y)` + `__site.state()` in the preview pane (RAF pauses when hidden — never wait, read back).
Stage 1: `drive(0)` → outs 0, video t .001, anim 0 · `drive(.45H)` → outTitle 1, vid .28 · `drive(1.6H)` → vid 1,
t = d − .001 · `drive(0)` → all back. Stage 2 @1470×956: `drive(yA)` → `media.visible` == `slot` ±.3px, pol 1, about.in 1;
`drive(2.0H)` → about.out 1, plate unchanged. Stage 3: `drive(2.5H)` → plate centre (735, 590), w 493; `drive(2.7H)` →
dis .5, cut opacity .5, same rect; `drive(3.1H)` → cars at 735 + d·420 (+22px breathe), rin 1; `drive(3.6H)` → words p .5,
first word 1 / last .12; `drive(4.5H)` → words hidden. Stage 4: `drive(4.7H)` → zoom .5, centre w 980, neighbours vis .5;
`drive(5.1H)` → centre w 1470 / cy 459, neighbours hidden, widgets.in .6; `drive(5.3H)` → all five widgets at translate 0.
Stage 5: `drive(6.3H)` → idx 1, «Porsche», car 1 at 735, car 0 at −301 hidden; `drive(5.7H)` → f .4 → idx stays 0 and the
page snaps back to 5.3H; `[data-next].click()` → Lenis glides to 6.3H, cur tweens 0→1, name swaps after the out phase.
The pane's timers run ~3× slow — a snap that is "still moving" 2s later is the rig, not the site. Screenshots of a scrolled page in the pane black out — trust the numbers;
wait ≥3.5s after load before reading (the intro is still running in a slow pane).
