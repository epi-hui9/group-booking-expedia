# GIF Capture Guide

Short, slide-ready GIFs (~3 seconds each) of isolated product moments for
the pitch deck. This iteration ships **pre-rendered GIFs and screenshots**
so you don't have to capture anything to present. Re-capture only if the UI
changes.

---

## Where the assets live

```
assets/
  demo-gifs/                      committed, slide-ready GIFs
    01-add-hotel-to-group-trip.gif
    02-open-group-trip-dashboard.gif
    03-group-consensus-visible.gif
    04-not-for-me-reason.gif
    05-remove-option.gif
    06-price-clarity.gif
    07-continue-to-booking-handoff.gif
    _video/                       raw .webm recordings (git-ignored)
  demo-captures/                  committed, final-state PNG screenshots
    01-…png … 07-…png
```

GIFs are ~960px wide at 15fps — clean on a slide without being huge. The
PNG screenshots are a high-resolution fallback if a slide tool prefers a
static image, or if a GIF is too heavy for a given deck.

---

## Shot list (what each asset shows)

| File                              | Moment                                                    |
| --------------------------------- | --------------------------------------------------------- |
| `01-add-hotel-to-group-trip`      | Search results → **Add to group trip** → confirmation toast |
| `02-open-group-trip-dashboard`    | Top-level **View group trip** → shared dashboard opens     |
| `03-group-consensus-visible`      | Dashboard hero: *"The group is leaning toward Wynn Las Vegas"* |
| `04-not-for-me-reason`            | React **Not for me** → reason chip → appears in "Why not for me" |
| `05-remove-option`                | Organizer removes an option (`⋯` → Remove → confirm → fade) |
| `06-price-clarity`                | Per-night **and** total price on the option detail         |
| `07-continue-to-booking-handoff`  | **Continue to booking** → final aligned handoff screen     |

---

## How to re-capture

Requirements:

- Node 18+ and the project's dependencies installed (`npm install`).
- A Chromium browser for Playwright: `npx playwright install chromium`.
- `ffmpeg` on your PATH (for the GIF conversion step). On macOS:
  `brew install ffmpeg`. If `ffmpeg` is missing, the script still produces
  the `.webm` recordings and PNG screenshots; only the `.gif` step is
  skipped.

Steps:

```bash
# 1) Build and serve the app on a fixed port
npm run build
npm run preview -- --port 4173 --strictPort

# 2) In a second terminal, run the capture
node scripts/capture-gifs.mjs
# (optional) point at a different server:
#   BASE_URL=http://localhost:5173 node scripts/capture-gifs.mjs
```

The script (`scripts/capture-gifs.mjs`) opens an isolated browser context
per moment, performs the clicks, records a short video, saves a final-state
screenshot, and converts each video to a GIF with ffmpeg.

---

## How to use the GIFs in the deck

- Drop one GIF per slide to narrate a single product beat. The recommended
  story order is `01 → 02 → 03 → 04 → 05 → 06 → 07`.
- In Keynote/PowerPoint/Google Slides, insert the GIF as an image; it loops
  automatically.
- If a GIF feels too fast or too large for a venue, use the matching PNG in
  `assets/demo-captures/` as a static fallback.

---

## Notes & limitations

- Capture uses a 1280×800 viewport at 2× device scale for crispness.
- Imagery is loaded from remote Unsplash URLs, so capture needs network
  access at the time you run it.
- GIF file sizes are a few MB each (lossless-ish palette). If you need them
  smaller, lower the `fps`/`scale` values in `scripts/capture-gifs.mjs` or
  trim with any GIF optimizer.
- The presenter-only walkthrough overlay is disabled during capture, so it
  never appears in the assets.
