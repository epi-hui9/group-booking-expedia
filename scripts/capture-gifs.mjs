// Slide-ready capture script for the Group Trips prototype.
//
// For each product "moment" it records a short Playwright video, takes a
// final screenshot, and (if ffmpeg is available) converts the video into a
// ~3s GIF for the pitch deck.
//
// Usage:
//   1. Build + preview the app on a known port, e.g.:
//        npm run build && npm run preview -- --port 4173
//   2. In another terminal:
//        node scripts/capture-gifs.mjs
//
// Env:
//   BASE_URL   default http://localhost:4173
//
// Output:
//   assets/demo-gifs/*.gif         final GIFs (if ffmpeg present)
//   assets/demo-gifs/_video/*.webm raw recordings
//   assets/demo-captures/*.png     final-state screenshots (always)

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
const VIEWPORT = { width: 1280, height: 800 };

const gifDir = path.join(root, "assets", "demo-gifs");
const videoDir = path.join(gifDir, "_video");
const shotDir = path.join(root, "assets", "demo-captures");
for (const d of [gifDir, videoDir, shotDir]) fs.mkdirSync(d, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function hasFfmpeg() {
  try {
    await execFileAsync("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Run one isolated "moment": a fresh context with video recording, run the
 * steps, then save the video under a stable name.
 */
async function moment(browser, name, steps) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    recordVideo: { dir: videoDir, size: VIEWPORT },
  });
  const page = await context.newPage();
  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await wait(400);
    await steps(page);
    await wait(500);
    await page.screenshot({ path: path.join(shotDir, `${name}.png`) });
  } catch (err) {
    console.error(`  ! ${name} failed:`, err.message);
  }
  const video = page.video();
  await context.close(); // flush the video
  if (video) {
    const src = await video.path();
    const dest = path.join(videoDir, `${name}.webm`);
    try {
      fs.renameSync(src, dest);
    } catch {
      fs.copyFileSync(src, dest);
    }
  }
  console.log(`  ✓ captured ${name}`);
}

async function toGif(name) {
  const src = path.join(videoDir, `${name}.webm`);
  const out = path.join(gifDir, `${name}.gif`);
  if (!fs.existsSync(src)) return;
  const vf =
    "fps=15,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer";
  await execFileAsync("ffmpeg", ["-y", "-i", src, "-vf", vf, "-loop", "0", out]);
  console.log(`  ✓ gif ${name}.gif`);
}

// Helpers scoped to the open modal (the centered card with shadow-hero).
const modal = (page) => page.locator(".shadow-hero").last();

async function openDashboard(page) {
  await page.getByText("View group trip").first().click();
  await page.getByText("The group is leaning toward").waitFor();
  await wait(600);
}

async function main() {
  const ffmpeg = await hasFfmpeg();
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`ffmpeg: ${ffmpeg ? "available" : "NOT FOUND (GIFs skipped)"}`);

  const browser = await chromium.launch();

  await moment(browser, "01-add-hotel-to-group-trip", async (page) => {
    const add = page.getByRole("button", { name: "Add to group trip" });
    await add.scrollIntoViewIfNeeded();
    await wait(500);
    await add.click();
    await page.getByText("added to Vegas Weekend").waitFor();
    await wait(1800);
  });

  await moment(browser, "02-open-group-trip-dashboard", async (page) => {
    await wait(500);
    await page.getByText("View group trip").first().click();
    await page.getByText("The group is leaning toward").waitFor();
    await wait(1800);
  });

  await moment(browser, "03-group-consensus-visible", async (page) => {
    await openDashboard(page);
    await wait(2200);
  });

  await moment(browser, "04-not-for-me-reason", async (page) => {
    await openDashboard(page);
    await page.getByRole("button", { name: "The Venetian Resort" }).first().click();
    const m = modal(page);
    await m.waitFor();
    await wait(700);
    await m.getByRole("button", { name: "Not for me" }).click();
    await wait(900);
    await m.getByRole("button", { name: "Too expensive", exact: true }).click();
    await wait(500);
    await m.getByRole("button", { name: "Share with organizer" }).click();
    await wait(1600);
  });

  await moment(browser, "05-remove-option", async (page) => {
    await openDashboard(page);
    await page.getByRole("button", { name: "Option actions" }).last().click();
    await wait(600);
    await page.getByRole("button", { name: "Remove from trip" }).click();
    await wait(600);
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await wait(1500);
  });

  await moment(browser, "06-price-clarity", async (page) => {
    await openDashboard(page);
    await page.getByRole("button", { name: "Wynn Las Vegas" }).first().click();
    await modal(page).waitFor();
    await wait(2400);
  });

  await moment(browser, "07-continue-to-booking-handoff", async (page) => {
    await openDashboard(page);
    await page.getByRole("button", { name: "Continue to booking" }).first().click();
    await page.getByText("ready to move forward").waitFor();
    await wait(2200);
  });

  await browser.close();

  if (ffmpeg) {
    console.log("Converting videos to GIFs…");
    for (const f of fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"))) {
      await toGif(path.basename(f, ".webm"));
    }
  }

  console.log("\nDone.");
  console.log(`GIFs:        ${gifDir}`);
  console.log(`Screenshots: ${shotDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
