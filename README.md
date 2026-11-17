# brand (new-14) — CDN build

Byte-for-byte the site as built, with **every media file remote**: the all-intra hero clip, its poster and the
five car cut-outs live on Higgsfield storage (CloudFront, `access-control-allow-origin: *`, byte ranges — the
scroll scrub needs them); GSAP 3.13 + Locomotive Scroll 5 and Bootstrap Icons 1.13.1 from jsDelivr; Inter Tight
from Google Fonts. **Needs an internet connection.** For a copy that runs with the network off, use
`../new-14-offline`.

```bash
npx serve . -l 5193
```

`file://` will not work — ES modules and the clip's range requests need a real HTTP origin.

The spec is `DESIGN.md` — hand it over together with `index.html`, `style.css`, `main.js` and `lib/` and the site
can be rebuilt or turned into a prompt without any local file.

## Media

| local (in `../new-14`) | URL |
|---|---|
| `assets/video/hero.mp4` (all-intra H.264, 8.04 s, 193 I-frames, 7.7 MB) | https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/58a84706-cc4c-494c-a1e6-13c8469f128d.mp4 |
| `assets/img/hero-poster.jpg` | https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/d95584a7-788a-44d7-9599-b02bd19aa092.jpg |
| `assets/img/car-0.png` Mercedes S-Class | https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/ff5d729f-94d6-4a74-808b-a27bd264a768.png |
| `assets/img/car-1.png` Porsche 911 Carrera | https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/f999be6e-5e04-4f8e-80c4-9f36260a00de.png |
| `assets/img/car-2.png` Range Rover Autobiography | https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/48d9cc8e-60cb-430a-9e36-ccd22949fa04.png |
| `assets/img/car-3.png` BMW 7 Series (card 4) | https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/06b0cd99-f8fb-4a66-a254-eb8daee3e4ed.png |
| `assets/img/car-4.png` Bentley Continental GT (card 3) | https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/9ce67fcf-e0d4-437e-ab0e-e07216fc9ffe.png |

The `<video>` carries `crossorigin="anonymous"` (CloudFront answers with CORS), so a future canvas / WebGL pass can
read its frames without a rebuild.
