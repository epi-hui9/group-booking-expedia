// Slide-ready demo capture for the Group Trips prototype.
//
// Records a polished clip per product "moment" using an injected capture
// overlay (virtual cursor + click ripples + smooth camera zoom/pan +
// spotlight), then encodes each clip to MP4 (primary), WebM, and GIF, plus
// a clean full-frame PNG.
//
// Usage:
//   1. npm run build && npm run preview -- --port 4173 --strictPort
//   2. node scripts/capture-gifs.mjs        (BASE_URL optional)
//
// Output:
//   assets/demo-videos/*.mp4   primary, crisp, slide-ready
//   assets/demo-videos/*.webm  alternate video
//   assets/demo-gifs/*.gif     GIF (looping) for tools that need it
//   assets/demo-captures/*.png final-state screenshots
//   assets/demo-gifs/_video/*.webm  raw recordings (git-ignored)

import { chromium } from "playwright";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const BASE_URL = process.env.BASE_URL || "http://localhost:4173";
const VIEWPORT = { width: 1440, height: 900 };
const KIT = fs.readFileSync(path.join(__dirname, "capture-kit.js"), "utf8");

const gifDir = path.join(root, "assets", "demo-gifs");
const rawDir = path.join(gifDir, "_video");
const vidDir = path.join(root, "assets", "demo-videos");
const shotDir = path.join(root, "assets", "demo-captures");
for (const d of [gifDir, rawDir, vidDir, shotDir])
  fs.mkdirSync(d, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function hasFfmpeg() {
  try {
    await execFileAsync("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

// ---- in-page helpers -------------------------------------------------------

const cap = (page, fn, arg) => page.evaluate(fn, arg);

async function box(locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  return await locator.boundingBox();
}

async function moveTo(page, locator) {
  const b = await box(locator);
  if (!b) return;
  await cap(page, (b) => window.__cap.cursorTo(b.x + b.width / 2, b.y + b.height / 2), b);
}

async function click(page, locator) {
  const b = await box(locator);
  if (!b) return;
  await cap(page, (b) => window.__cap.cursorTo(b.x + b.width / 2, b.y + b.height / 2), b);
  await cap(page, (b) => window.__cap.ripple(b.x + b.width / 2, b.y + b.height / 2), b);
  await locator.click();
}

async function focus(page, locator, scale) {
  const b = await box(locator);
  if (!b) return;
  await cap(page, ({ b, scale }) => window.__cap.focus(b, scale), { b, scale });
}

async function spotlight(page, locator) {
  const b = await box(locator);
  if (!b) return;
  await cap(page, (b) => window.__cap.spotlight(b), b);
}

const reset = (page) => cap(page, () => window.__cap.reset());
const clearSpot = (page) => cap(page, () => window.__cap.clearSpotlight());

// Navigate search -> dashboard quietly (used as scene lead-in; trimmed off).
async function gotoDashboard(page) {
  await page.getByText("View group trip").first().click();
  await page.getByText("The group is leaning toward").waitFor();
  await wait(500);
}

async function finalize(page, name) {
  await cap(page, () => window.__cap.hideCursor());
  await clearSpot(page);
  await reset(page);
  await wait(700);
  await page.screenshot({ path: path.join(shotDir, `${name}.png`) });
}

// ---- scene runner ----------------------------------------------------------

async function moment(browser, name, clip, steps) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: rawDir, size: VIEWPORT },
  });
  await context.addInitScript({ content: KIT });
  const page = await context.newPage();
  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !!window.__cap, null, { timeout: 5000 });
    await wait(500);
    await steps(page);
    await wait(400);
    await finalize(page, name);
  } catch (err) {
    console.error(`  ! ${name} failed:`, err.message);
  }
  const video = page.video();
  await context.close();
  if (video) {
    const src = await video.path();
    const dest = path.join(rawDir, `${name}.webm`);
    try {
      fs.renameSync(src, dest);
    } catch {
      fs.copyFileSync(src, dest);
    }
  }
  console.log(`  \u2713 captured ${name} (clip ${clip.start}s + ${clip.dur}s)`);
}

// ---- encoders --------------------------------------------------------------

async function encode(name, clip) {
  const src = path.join(rawDir, `${name}.webm`);
  if (!fs.existsSync(src)) return;
  // Trim the lead-in and the finalize tail so the clip is a tight,
  // slide-ready moment that ends on the held final state.
  const cut = ["-ss", String(clip.start), "-t", String(clip.dur)];

  // MP4 (primary): crisp 1440-wide H.264.
  await execFileAsync("ffmpeg", [
    "-y", ...cut, "-i", src,
    "-vf", "fps=30,scale=1440:-2:flags=lanczos",
    "-c:v", "libx264", "-crf", "19", "-preset", "medium",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
    path.join(vidDir, `${name}.mp4`),
  ]);

  // WebM (VP9) alternate.
  await execFileAsync("ffmpeg", [
    "-y", ...cut, "-i", src,
    "-vf", "fps=30,scale=1440:-2:flags=lanczos",
    "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0",
    "-deadline", "good", "-cpu-used", "3", "-an",
    path.join(vidDir, `${name}.webm`),
  ]);

  // GIF (1040-wide, readable, optimized size) via palette.
  const gif = path.join(gifDir, `${name}.gif`);
  await execFileAsync("ffmpeg", [
    "-y", ...cut, "-i", src,
    "-vf",
    "fps=14,scale=1040:-1:flags=lanczos,split[a][b];" +
      "[a]palettegen=max_colors=128:stats_mode=diff[p];" +
      "[b][p]paletteuse=dither=bayer:bayer_scale=2:diff_mode=rectangle",
    "-loop", "0", gif,
  ]);
  console.log(`  \u2713 encoded ${name} (mp4 + webm + gif)`);
}

// ---- main ------------------------------------------------------------------

async function main() {
  const ffmpeg = await hasFfmpeg();
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`ffmpeg: ${ffmpeg ? "available" : "NOT FOUND (encode skipped)"}`);

  const browser = await chromium.launch();

  // Per-scene clip windows (seconds): trim the lead-in + finalize tail so
  // each final asset is a tight, slide-ready moment.
  const clips = {
    "01-add-hotel-to-group-trip": { start: 0.8, dur: 4.6 },
    "02-open-group-trip-dashboard": { start: 0.8, dur: 4.6 },
    "03-group-consensus-visible": { start: 2.2, dur: 5.2 },
    "04-not-for-me-reason": { start: 2.4, dur: 7.4 },
    "05-remove-option": { start: 2.4, dur: 7.6 },
    "06-price-clarity": { start: 2.2, dur: 5.6 },
    "07-continue-to-booking-handoff": { start: 2.2, dur: 6.6 },
  };

  // 01 — Add hotel to group trip
  await moment(browser, "01-add-hotel-to-group-trip",
    clips["01-add-hotel-to-group-trip"], async (page) => {
      const add = page.getByRole("button", { name: "Add to group trip" });
      await focus(page, add, 1.45);
      await click(page, add);
      await page.getByText("added to Vegas Weekend").waitFor();
      await reset(page);
      await wait(1700);
    });

  // 02 — Open group trip dashboard
  await moment(browser, "02-open-group-trip-dashboard",
    clips["02-open-group-trip-dashboard"], async (page) => {
      const entry = page.getByText("View group trip").first();
      await focus(page, entry, 1.3);
      await click(page, entry);
      await page.getByText("The group is leaning toward").waitFor();
      await reset(page);
      await wait(1500);
    });

  // 03 — Group consensus visible
  await moment(browser, "03-group-consensus-visible",
    clips["03-group-consensus-visible"], async (page) => {
      await gotoDashboard(page);
      await focus(page, page.getByText("The group is leaning toward"), 1.22);
      await wait(1500);
      await focus(page, page.getByText("Leading option").first(), 1.3);
      await wait(1900);
    });

  // 04 — Not for me + reason (modal: spotlight only, no camera zoom)
  await moment(browser, "04-not-for-me-reason",
    clips["04-not-for-me-reason"], async (page) => {
      await gotoDashboard(page);
      await page.getByRole("button", { name: "The Venetian Resort" }).first().click();
      const modalCard = page.locator(".shadow-hero").last();
      await modalCard.waitFor();
      await wait(600);
      await click(page, modalCard.getByRole("button", { name: "Not for me" }));
      await wait(700);
      await click(page, modalCard.getByRole("button", { name: "Too expensive", exact: true }));
      await wait(400);
      await click(page, modalCard.getByRole("button", { name: "Share with organizer" }));
      await wait(700);
      await spotlight(page, page.getByText("Why not for me").last());
      await wait(1600);
    });

  // 05 — Remove option
  await moment(browser, "05-remove-option",
    clips["05-remove-option"], async (page) => {
      await gotoDashboard(page);
      const menuBtn = page.getByRole("button", { name: "Option actions" }).last();
      await focus(page, menuBtn, 1.35);
      await click(page, menuBtn);
      await wait(500);
      await click(page, page.getByRole("button", { name: "Remove from trip" }));
      await wait(500);
      await reset(page);
      await click(page, page.getByRole("button", { name: "Remove", exact: true }));
      await page.getByText("removed from Vegas Weekend").waitFor();
      await wait(1500);
    });

  // 06 — Price clarity (modal: spotlight on price, no camera zoom)
  await moment(browser, "06-price-clarity",
    clips["06-price-clarity"], async (page) => {
      await gotoDashboard(page);
      await page.getByRole("button", { name: "Wynn Las Vegas" }).first().click();
      const modalCard = page.locator(".shadow-hero").last();
      await modalCard.waitFor();
      await wait(700);
      const price = page.locator("[data-cap='price']");
      await moveTo(page, price);
      await spotlight(page, price);
      await wait(2600);
    });

  // 07 — Continue to booking / handoff
  await moment(browser, "07-continue-to-booking-handoff",
    clips["07-continue-to-booking-handoff"], async (page) => {
      await gotoDashboard(page);
      await click(page, page.getByRole("button", { name: "Continue to booking" }).first());
      await page.getByText("ready to move forward").waitFor();
      await wait(700);
      const checkout = page.getByRole("button", { name: "Continue to checkout" });
      await focus(page, checkout, 1.25);
      await click(page, checkout);
      await page.getByText("Handed off to checkout").waitFor();
      await reset(page);
      await wait(1700);
    });

  await browser.close();

  if (ffmpeg) {
    console.log("Encoding clips (mp4 / webm / gif)\u2026");
    for (const name of Object.keys(clips)) await encode(name, clips[name]);
  }

  console.log("\nDone.");
  console.log(`Videos:      ${vidDir}`);
  console.log(`GIFs:        ${gifDir}`);
  console.log(`Screenshots: ${shotDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
