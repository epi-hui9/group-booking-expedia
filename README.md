# Expedia Group Trips — Shared Decision-Making Dashboard

A high-fidelity, click-through concept prototype of a Group Travel feature
for Expedia: one shared place where a group can see its current consensus on
hotel options and move from discussion to booking without leaving Expedia.

> **Strategic story.** Group travel decisions usually happen outside
> Expedia (in group chats), so the booking often leaks to another product.
> This dashboard keeps the decision inside Expedia by making the group's
> consensus visible at a glance.

This is a presentation prototype, not production software: front-end only,
hardcoded mock data, no backend, no auth, no payment, no real booking.

## Run it

```bash
npm install
npm run dev        # open the URL Vite prints (defaults to http://localhost:5173)
```

Other commands:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

A presenter-only walkthrough overlay is hidden by default. Enable it during
rehearsal with `?dev=1` in the URL or `Alt+Shift+D`; hide it before
presenting.

## Demo flow

Search results → **Add to group trip** → **View group trip** → dashboard
(*"The group is leaning toward Wynn Las Vegas"*) → see **Why not for me**
friction → react (optionally with a reason) → organizer can **remove** a
weak option → **Continue to booking** → ready/handoff screen.

## Documentation

- [`docs/PROTOTYPE_NOTES.md`](docs/PROTOTYPE_NOTES.md) — full product +
  engineering notes (scope, flow, data, design tokens).
- [`docs/FEEDBACK_CHANGES.md`](docs/FEEDBACK_CHANGES.md) — what changed in
  the latest feedback-driven iteration.
- [`docs/GIF_CAPTURE_GUIDE.md`](docs/GIF_CAPTURE_GUIDE.md) — slide-ready
  GIFs/screenshots and how to re-capture them.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS.
