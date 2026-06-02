# Feedback Changes

## Iteration 3 — Visual fixes & presentation assets

A focused visual-correctness pass (no product/scope changes):

- **Fixed broken hotel imagery.** The Venetian Resort image was a dead remote
  URL (404) rendering as alt text. All hotel images are now bundled locally
  under `public/hotel-images/` (`wynn.jpg`, `venetian.jpg`, `mgm.jpg`) and
  referenced by local path, so nothing depends on a remote CDN.
- **Graceful image fallback.** A new `HotelImage` component renders a calm,
  Expedia-grade placeholder (soft gradient + hotel icon + name) if any image
  fails to load — never the browser's broken-image icon or raw alt text. All
  hotel `<img>` usages now route through it.
- **Rebuilt the demo capture system** for slide-ready output: a capture-only
  overlay (`scripts/capture-kit.js`) adds a visible virtual cursor, click
  ripples, smooth camera zoom/pan, and a focus spotlight. Clips are encoded to
  **MP4 (preferred), WebM, and GIF**, plus PNG stills. See
  [`GIF_CAPTURE_GUIDE.md`](./GIF_CAPTURE_GUIDE.md). Assets live in
  `assets/demo-videos/`, `assets/demo-gifs/`, and `assets/demo-captures/`.
- Capture tooling is presentation-only and adds no production functionality.

---

## Iteration 2 — Feedback-driven product changes

This document records the changes made to the Shared Decision-Making
Dashboard prototype in response to peer feedback and instructor feedback
gathered after the first pitch. It is intentionally self-contained so a
future contributor (human or AI) can understand the rationale without
reading any chat history. No real individuals are named; all input is
referred to generically as **peer feedback** and **instructor feedback**.

---

## 1. What feedback was incorporated

1. **Group Trips should imply more than hotels (including flights), while
   the demo stays hotel-focused.** Added a subtle, trip-level
   **Hotels / Flights** tab row in the group trip header. Hotels is the
   active surface; Flights is a non-functional **"Coming soon"** affordance.
   No flight search, inventory, or booking flow was built.
2. **There was no Remove control.** Added a calm, product-grade
   **Remove from trip** action in an overflow (`⋯`) menu on each option
   row, with a lightweight inline confirmation and a clean fade-out.
3. **"View group trip" was repeated inside every hotel card.** Removed the
   per-card CTA. The single trip-level entry point now lives once at the
   top of the search screen (and in the top nav). Added hotels simply show
   an **"In group trip"** status chip.
4. **User-facing build/AI/prototype language.** Audited all visible copy.
   The optional presenter-only navigator was relabeled from
   "Prototype flow / Demo flow" to **"Presenter walkthrough / Walkthrough."**
   No vibe-coding, GenAI, or AI-build language is present in the UI.
5. **"Not for me" needed a "why."** Added an optional reason mechanism:
   reason chips ("Too expensive," "Too far from the group plan," "Not the
   right room setup," "Wrong vibe") plus an optional short note. Submitted
   reasons surface to the organizer in a **"Why not for me"** section on the
   option detail modal, a compact friction row on each option card, the
   hero leading-option card, and the **"Who still needs to weigh in?"**
   panel.
6. **Pricing clarity (per-night + total).** Every relevant surface now
   shows both the nightly rate and the total for the stay, e.g.
   **"$349 / night"** and **"$1,047 total for 3 nights."**
7. **Redundant middle page.** The flow previously went
   Dashboard → Ready-to-book screen → a separate handoff modal. The handoff
   modal duplicated the ready screen, so it was removed and its essential
   guardrail copy was merged into the Ready-to-book screen. Clicking
   **Continue to checkout** now resolves into a clean inline
   **"Handed off to checkout"** confirmation — no blank transition.
8. **Documentation.** Updated `PROTOTYPE_NOTES.md` and added this file plus
   `GIF_CAPTURE_GUIDE.md`.
9. **Slide-ready GIFs.** Added a capture script and guide (see
   `GIF_CAPTURE_GUIDE.md`).

---

## 2. What changed in the prototype (by file)

- `src/data/mockData.ts` — Added `NotForMeReason` / `ReasonMap` types,
  `TRIP_NIGHTS`, pricing helpers (`totalForStay`, `formatCurrency`), the
  `NOT_FOR_ME_REASONS` chip list, and seeded `initialReasons` so the
  organizer sees real friction on first load.
- `src/state/useTripStore.ts` — Added `reasons` state,
  `setNotForMeReason`, and `removeOption`. `setReaction` now clears a
  member's reason when they move off "Not for me." Removed the unused
  `handoffOpen` state. `options` now carry `reasonsByMember`.
- `src/components/TripHeader.tsx` — Optional `showTabs` row for the
  Hotels (active) / Flights (coming soon) trip-level context.
- `src/components/OptionRow.tsx` — Overflow menu with **Remove from trip**
  (inline confirm + fade-out), total pricing, and a compact
  **"Why not for me"** summary chip row.
- `src/components/OptionDetailModal.tsx` — Reason picker (chips + optional
  note) shown after reacting "Not for me," plus an aggregated
  **"Why not for me"** section. Pricing copy clarified.
- `src/components/HeroConsensus.tsx` — Total pricing and a one-line
  friction summary on the leading option.
- `src/components/WhoNeedsPanel.tsx` — Shows the reason chip next to a
  member who reacted "Not for me."
- `src/screens/ReadyToBook.tsx` — Absorbed the handoff messaging; final
  inline "Handed off to checkout" confirmation; total pricing.
- `src/screens/SearchResults.tsx` — Removed per-card "View group trip";
  "In group trip" status chip; total pricing copy.
- `src/screens/EmptyDashboard.tsx` — Hotel-first copy; Flights shown as
  "Coming soon."
- `src/components/DemoNav.tsx` — Relabeled presenter-only navigator.
- `src/components/Icon.tsx` — Added `PlaneIcon`, `DotsIcon`, `TrashIcon`.
- Removed `src/components/HandoffModal.tsx`.

---

## 3. What was intentionally NOT changed

- No flight search, flight inventory screens, or flight booking flow.
  Flights are only acknowledged as a future, disabled entrance.
- No backend, auth, real notifications, payment, inventory hold, soft
  hold, or auto-booking were added. All state remains front-end mock
  state.
- No full comment thread or chat. "Why not for me" stays a single
  optional chip + short note per member.
- The core consensus model (Yes / Not for me / no reaction yet, ranking,
  readiness) was preserved. Silence is still not a negative signal.
- The overall visual system (Expedia navy/blue, yellow accent, warm
  neutrals, crisp cards) was preserved, not redesigned.

---

## 4. Current scope boundaries

- Presentation prototype, not production. Desktop-first (~1200px).
- Hardcoded mock data; reload resets to the seeded demo state.
- Hotel decision surface only; flights are a future entrance.
- The product shows consensus; it never votes, polls, nags, or books.

---

## 5. Current demo flow

1. **Search results** — hotel options for "Vegas Weekend."
2. **Add to group trip** — add a hotel; a confirmation toast appears with
   a single **View group trip** action.
3. **Group trip dashboard** — headline answers the only question:
   *"The group is leaning toward Wynn Las Vegas."*
4. **Friction visible** — the **"Why not for me"** context shows where the
   hesitation is (e.g., "Too expensive," "Not the right room setup").
5. **React with a reason** — open an option, react **Not for me**, pick a
   reason chip, optionally add a note, share it with the organizer.
6. **Remove a weak option** — organizer uses the `⋯` menu to remove an
   option, confirmed inline, with a clean fade-out.
7. **Continue to booking → handoff** — the Ready-to-book screen confirms
   alignment and hands off to checkout. No one is charged.

---

## 6. How to run

```bash
npm install
npm run dev      # open the URL Vite prints (defaults to http://localhost:5173)
npm run build    # type-check + production build
```

The presenter-only walkthrough overlay is hidden by default. Enable it
during rehearsal with `?dev=1` in the URL or `Alt+Shift+D`. Hide it before
presenting to executives.

---

## 7. Known limitations

- Reactions update only on the local presenter's clicks; there is no
  multiplayer simulation.
- Imagery is loaded from remote Unsplash URLs and depends on network
  availability at presentation time.
- The layout is desktop-only and not responsive below ~1024px.
- GIF capture depends on the local environment (Node, a Chromium browser
  for Playwright, and ffmpeg). See `GIF_CAPTURE_GUIDE.md`.
