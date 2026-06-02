# Demo Capture Guide

Slide-ready clips of seven isolated product moments, captured with a polished
demo style: a visible virtual cursor, click ripples, smooth camera zoom/pan,
and a focus spotlight. Pre-rendered assets are committed, so you don't need
to capture anything to present.

---

## Recommended for slides: use the MP4

For Google Slides, PowerPoint, and Keynote, **insert the MP4** — it is the
highest-quality, smallest, and crispest artifact (text stays sharp, ~1–2 MB
each, H.264 1440-wide @30fps, looping when set to autoplay/loop).

Use the GIF only for tools that accept images but not video. The GIFs are
optimized (1040-wide @14fps, ~3.5–7 MB) and stay readable, but MP4 is clearly
better. The PNGs are a static fallback for any final-state slide.

---

## Where the assets live

```
assets/
  demo-videos/                    PREFERRED — slide-ready clips
    01-…mp4 … 07-…mp4             H.264, 1440w, ~1–2 MB
    01-…webm … 07-…webm           VP9 alternate
  demo-gifs/                      GIF fallback (looping)
    01-…gif … 07-…gif             1040w, optimized
    _video/                       raw recordings (git-ignored)
  demo-captures/                  final-state PNG screenshots
    01-…png … 07-…png
```

---

## Shot list (what each clip shows)

| File                              | Moment                                                     |
| --------------------------------- | ---------------------------------------------------------- |
| `01-add-hotel-to-group-trip`      | Zoom to the card → cursor clicks **Add to group trip** → toast |
| `02-open-group-trip-dashboard`    | Cursor clicks the single top-level **View group trip** entry → dashboard |
| `03-group-consensus-visible`      | Pan/zoom into the hero: *"The group is leaning toward Wynn Las Vegas"* |
| `04-not-for-me-reason`            | React **Not for me** → pick a reason chip → it joins **"Why not for me"** |
| `05-remove-option`                | `⋯` menu → **Remove from trip** → confirm → option removed (toast) |
| `06-price-clarity`                | Spotlight on per-night **and** total price in the detail view |
| `07-continue-to-booking-handoff`  | **Continue to booking** → **Continue to checkout** → calm handoff |

Each clip is ~4.5–7.5 seconds and holds on the final state so a slide
audience can read the result. The "Not for me" moment is shown as a calm
reason/reservation, never a shaming block.

---

## Capture style (built into the capture system)

- **Virtual cursor** — a DOM overlay arrow (not the OS cursor) that moves
  smoothly to each target and is always visible in the output.
- **Click ripple** — an Expedia-blue pulse on every click, with a subtle
  cursor "press."
- **Camera zoom / pan** — a smooth transform on the app that frames the
  relevant card/button/panel, then eases back out.
- **Spotlight** — a soft radial dim that focuses attention (used on the
  "Why not for me" read-out and the price block).
- **Clean frame** — no browser chrome, no dev UI, no broken images, no
  console/debug text. Captured at 1440×900.

All of this is **capture-only**. It is injected at recording time by
`scripts/capture-kit.js` and is never part of the shipped app or any
production functionality.

---

## How to regenerate

Requirements:

- `npm install`, then a Chromium for Playwright: `npx playwright install chromium`.
- `ffmpeg` on your PATH (macOS: `brew install ffmpeg`). Without ffmpeg the
  script still writes the raw `.webm` recordings and PNG screenshots; only
  the MP4/WebM/GIF encoding step is skipped.

Steps:

```bash
# 1) Build and serve on a fixed port
npm run build
npm run preview -- --port 4173 --strictPort

# 2) In a second terminal, run the capture
node scripts/capture-gifs.mjs
#   (optional) BASE_URL=http://localhost:5173 node scripts/capture-gifs.mjs
```

The script records each moment, then encodes a trimmed, slide-ready MP4
(primary), WebM, and GIF, plus a clean PNG. Per-scene clip windows
(`start` + `dur`) are defined at the top of `main()` in
`scripts/capture-gifs.mjs`; adjust them there if you change timings.

---

## Notes & limitations

- Hotel imagery is bundled locally under `public/hotel-images/`, so capture
  no longer depends on a remote CDN.
- GIF sizes are a few MB; if you need them smaller, lower `fps`/`scale` or the
  palette `max_colors` in the GIF step of `scripts/capture-gifs.mjs`, or run
  the GIFs through an optimizer (e.g. `gifsicle --lossy`).
- Capture mode is presentation-only and adds no production behavior to the
  prototype.
