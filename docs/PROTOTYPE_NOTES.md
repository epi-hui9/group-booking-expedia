# Expedia Group Trips — Shared Decision-Making Dashboard

Prototype notes for the project team and any future AI assistant. The
document is intentionally self-contained: a future agent should be able to
pick up the project from these notes alone, without reading conversation
history.

---

## 1. Project purpose

The prototype demonstrates a new Expedia Group Travel feature called the
**Shared Decision-Making Dashboard**. The dashboard gives a group planning
a trip on Expedia one shared place to compare options and make a decision
together, instead of coordinating across screenshots, group chats, and
payment apps.

The core product truth the prototype must communicate to Expedia
leadership in roughly ten seconds:

> Group travel decisions usually happen outside Expedia, so the booking
> often leaks to another product. This dashboard keeps the decision inside
> Expedia by making the group's current consensus visible at a glance.

---

## 2. Product context

- The audience for the live demo is Expedia leadership.
- The prototype is a click-through frontend demo, not production software.
- Group members react to options with **Yes** or **Not for me**. Silence is
  not a negative signal — it simply means "not yet weighed in."
- The dashboard's job is to make the group's preference visible to itself,
  not to vote, poll, nag, or auto-book.
- Strategic positioning: this is decision visibility, not transaction
  mechanics.

The product philosophy line used throughout:

> Groups don't lack opinions. They lack a way to see them.

---

## 3. Prototype scope

- Desktop-first, laptop-width (~1200px max content) React app.
- Mock data only. No backend, no database, no real auth, no real API.
- Hardcoded screen state managed through a single in-memory store hook.
- Clickable end-to-end demo flow.
- Imagery is loaded from public Unsplash URLs to avoid bundling binaries.

---

## 4. What is included

- A simplified Expedia-style search results entry point.
- An empty group trip dashboard with a single clear next action.
- A main dashboard that ranks options by group support and surfaces the
  leading option.
- A clean, focused option detail modal where reactions can be changed.
- A ready-to-book screen and a handoff modal that hands off to (mock)
  booking without performing it.
- An organizer-facing **lightweight reminder micro-interaction** for group
  members who have not weighed in yet. The reminder is a simulated
  front-end action only; no notification infrastructure, email, SMS, or
  backend is involved. See Section 9 for behavior.
- A small floating dev navigator usable for live presenting (off by
  default, see Section 15).

---

## 5. What is excluded

- Payment, cost splitting, Venmo-style flows, real checkout.
- Real booking engine, real inventory, real availability.
- Inventory holds, "soft hold", "24-hour hold", "lock in this room" — any
  language that implies holding inventory is out of scope.
- Auto-booking. The dashboard never books on the group's behalf.
- AI travel agent, chat replacement, external WhatsApp / TikTok parsing.
- Real authentication or persistence.
- Aggressive polling / voting UI. Yes / Not for me chips, never "Cast
  vote" or "Submit preference."
- Real notifications, email, or SMS. The organizer reminder is a
  simulated UI state change only, never an outbound message.

---

## 6. Main user flow

The presenter walks through the demo in this exact path. The UI should
make each next click obvious without verbal explanation.

1. **Search Results** — the presenter lands on Expedia's stays search.
   The traveler is planning **Vegas Weekend** with 6 friends. A subtle
   banner under the search bar makes the group trip context visible.
2. **Add to group trip** — the third hotel (MGM Grand) is not yet in the
   trip. Clicking **Add to group trip** marks it as added and shows a
   confirmation toast with a single primary next action: **View group
   trip**.
3. **Dashboard** — the headline answers the only question that matters:
   *"The group is leaning toward Wynn Las Vegas."* The hero card shows the
   leading option with consensus visualization and the primary action
   **Continue to booking**.
4. **React on an option** — the presenter clicks **Yes** or **Not for me**
   on a compact comparison row, or opens the option detail modal. The
   consensus state updates immediately.
5. **Optional reminder** — in the **Who still needs to weigh in?** side
   panel, the organizer can click a small **Remind** button next to any
   member who has no reaction yet. The button swaps to a quiet
   "Reminder sent" chip and a subtle toast confirms the action. This is a
   simulated UI state only.
6. **Ready to book** — clicking **Continue to booking** routes to the
   ready screen. One hero card, one CTA, one guardrail line.
7. **Handoff modal** — clicking **Continue to booking** again opens a
   short modal that confirms the handoff: *"You'll review rooms, taxes,
   and payment details next. No one is charged yet."* No real checkout is
   built.

---

## 7. Screen list

| #   | Screen                | File                                  |
| --- | --------------------- | ------------------------------------- |
| 1   | Search Results        | `src/screens/SearchResults.tsx`       |
| 2   | Empty Dashboard       | `src/screens/EmptyDashboard.tsx`      |
| 3   | Main Dashboard        | `src/screens/Dashboard.tsx`           |
| 4   | Option Detail (modal) | `src/components/OptionDetailModal.tsx` |
| 5   | Ready to Book         | `src/screens/ReadyToBook.tsx`         |
| 5b  | Handoff modal         | `src/components/HandoffModal.tsx`     |

Supporting components live in `src/components/`. The shared trip header,
hero consensus card, compact option rows, "Who still needs to weigh in?"
side panel, toast, top nav, avatars, and consensus meter are all
small, single-purpose components.

The optional dev-only navigator lives at `src/components/DemoNav.tsx`.

---

## 8. Mock data structure

All mock data lives in `src/data/mockData.ts`. There is no backend; data
is consumed directly by React components.

```ts
type GroupTrip = {
  id: string;
  name: string;        // "Vegas Weekend"
  destination: string; // "Las Vegas"
  dates: string;       // "Aug 15–18"
  guests: number;      // 6
};

type Member = {
  id: string;
  name: string;        // sample fictional names only
  initials: string;
  color: string;       // Tailwind class string for avatar color
};

type HotelOption = {
  id: string;
  name: string;
  type: "hotel";
  image: string;       // remote URL
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  location: string;
  addedBy: string;     // member id
  addedAtLabel: string;
  availability: "available" | "unavailable";
  description: string;
};

type ReactionValue = "yes" | "not_for_me" | null;
type ReactionMap   = Record<string, ReactionValue>;
```

`initialAddedOptionIds` controls which hotels are in the trip when the
prototype boots. `initialReactions` seeds member reactions so the
dashboard already shows a clear leading option on first render. The third
hotel in the catalog is intentionally **not** in the initial trip so the
presenter has something to add live.

Hotel names, member names, and avatars are illustrative only. Member
names are sample fictional travelers (Alex, Maya, Jordan, Sam, Priya,
Leo). The documentation must never identify real people behind those
names — they exist only to populate the UI.

---

## 9. Interaction logic

The store hook is in `src/state/useTripStore.ts`. It is deliberately small
and synchronous.

State shape:

- `screen` — current screen identifier: `"search" | "empty" | "dashboard" | "ready"`.
- `addedIds` — string ids for hotels currently in the trip.
- `reactions` — `Record<optionId, ReactionMap>`.
- `toast` — single in-flight toast, with an optional `action` discriminator
  (`"view_trip"` shows the "View group trip" CTA; otherwise the toast is
  informational only, e.g. for the reminder confirmation).
- `detailOptionId` — id of the option currently shown in the detail modal.
- `handoffOpen` — boolean for the handoff modal on the ready screen.
- `remindedMemberIds` — string ids of members the organizer has already
  reminded in the current session.

Key actions:

- `addOption(hotelId)` — adds the hotel to the trip, seeds an all-null
  reaction map with the current user pre-set to `"yes"`, and fires a
  toast with the "View group trip" action.
- `setReaction(optionId, memberId, value)` — updates a single member's
  reaction on an option.
- `sendReminder(memberId)` — organizer micro-interaction. Adds the member
  to `remindedMemberIds` and fires a calm confirmation toast in the form
  *"Reminder sent to {name}."*. Behavior rules:
  - Reminders are simulated front-end only — no message is sent and no
    backend is called.
  - The button is shown only for members whose standing is
    "No reaction yet" inside the "Who still needs to weigh in?" panel.
    Members who reacted Not for me do not get a reminder button.
  - Once reminded, the row replaces the button with a small "Reminder
    sent" success chip. The state is per-session and resets along with
    `resetTrip()` / `restoreDemo()`.
  - Copy is warm and low-pressure. The product never uses red badges,
    urgency, or shaming language for inactive members.
- `resetTrip()` — clears all options, reactions, and reminded members.
  Used by the dev navigator to demo the empty state.
- `restoreDemo()` — restores the canonical seeded state and clears
  reminded members.

There is no localStorage persistence. Refreshing the page resets to the
seeded demo state. This is intentional; the demo is meant to be
predictable.

---

## 10. Consensus ranking logic

Implemented as pure functions inside `src/state/useTripStore.ts`:

- `summarizeReactions(option)` → `{ yes, not, none, total }`.
- `rankOptions(options)` → an array of `RankedOption` enriched with
  `rank`, `isLeading`, `isPending`, `isTie`, `yes`, `not`, `none`.
- `getReadiness(options)` → an overall readiness signal:
  `"ready" | "close" | "forming" | "pending"`.

Ranking rules:

1. Available options come before unavailable options.
2. Among available options, more **Yes** reactions ranks higher.
3. On a tie on Yes, fewer **Not for me** reactions ranks higher.
4. An option is **eligible to lead** only if at least one Yes comes from
   someone other than the proposer. If only the proposer has reacted
   positively, the option is marked **Pending reactions** instead of
   leading.
5. If the top score is shared across multiple available options, those
   options receive `isTie = true`, presented as **Still close** in the UI.
6. Unavailable options are not eligible to lead. They are kept in the
   list, softened visually, and not silently removed.

Readiness:

- `ready` — leading option has Yes ≥ total − 1 and at most one member
  without a reaction. UI shows green pill and emphasizes
  **Continue to booking**.
- `close` — leading option has at least half of the group on Yes.
- `forming` — there is a leader, but support is not yet majority.
- `pending` — no eligible leading option yet.

---

## 11. Design principles

The second pass of this prototype is governed by these principles. Future
work should not violate them without a deliberate reason.

1. **Clarity is the luxury.** The most premium feeling for an executive
   demo is making the answer obvious in three seconds, not adding more
   data.
2. **One focal point per screen.** Each screen has exactly one primary
   answer and one primary next action.
3. **Show, don't poll.** Reactions are a lightweight signal, never a
   ballot. The product never says "vote", "winner", or "poll."
4. **Silence is not negative.** A member who has not reacted is "not yet
   weighed in." Avoid red badges or nagging copy. Reminders, when used,
   are warm and low-pressure ("Send a gentle reminder so the group can
   move forward").
5. **Alignment is visible. Commitment is still the group's.** The
   dashboard never auto-books. The group must take a deliberate action.
6. **Expedia-native, retail commerce feel.** Closer to Expedia.com stays
   than a corporate analytics dashboard.
7. **Restrained color.** Yellow is reserved for the moments that matter.
8. **No clever animation.** Subtle fade and pop are fine; bouncy is not.

---

## 12. Visual tokens / color notes

Tokens are defined in `tailwind.config.js` under `theme.extend.colors.expedia`
and consumed via Tailwind classes (e.g. `bg-expedia-blue`,
`text-expedia-ink`).

Primary palette:

- `expedia-navy` `#191E3B` — top nav background only.
- `expedia-blue` `#1668E3` — primary buttons, links, selected states.
- `expedia-blue-hover` `#0F50B5` — hover for primary buttons.
- `expedia-blue-soft` `#E8F0FE` — chip backgrounds, soft accents.
- `expedia-yellow` `#FFC72C` — the global search CTA, the leading-option
  badge, the "Add to group trip" call to action, and the underline accent
  behind the dashboard headline. Used sparingly.
- `expedia-yellow-hover` `#F4B800`.

Text and surfaces:

- `expedia-ink` `#0D1421` — headlines.
- `expedia-body` `#1F2937` — body copy.
- `expedia-slate` `#4B5563` — secondary copy.
- `expedia-mute` `#6B7280` — tertiary labels and metadata.
- `expedia-line` `#E5E7EB` — borders.
- `expedia-line-soft` `#F0F1F4` — internal dividers, meter background.
- `expedia-surface` `#F7F8FA` — page background behind cards.
- White is the dominant surface.

Status:

- `expedia-success` `#0F8A4C` / `expedia-success-soft` `#E6F4EC` — Yes
  reactions, "Ready to book" state, group-aligned badge.
- `expedia-warn` `#B25E13` / `expedia-warn-soft` `#FCF1E5` — Not for me
  reactions and Pending reactions chip.
- `expedia-danger` `#B23A2A` — only for the saved heart icon.

Typography:

- Display: Plus Jakarta Sans 700/800 for headlines.
- Body: Inter 400/500/600/700.

Shadows are intentionally light: `shadow-card`, `shadow-cardHover`,
`shadow-hero`. There is no heavy depth or glass effect.

---

## 13. Future iteration notes

Things a future agent can build on without breaking the simplicity
principle:

- Adding a fourth or fifth option in `hotelCatalog`. The ranking and UI
  are written to handle an arbitrary number of options, although the
  search screen currently shows only the first three.
- A real "unavailable" state. The data model supports it but no option
  is unavailable in the current demo. Display rules:
  - softened image (opacity ~0.7) and grayscale.
  - badge: **"No longer available."**
  - excluded from leading option calculation but kept in the list.
- A tie state demonstration. Set two options to the same Yes count to
  visualize the "Still close" tone.
- A second mock group trip. The store can be extended to multiple trips
  without rewriting the consensus logic.

Things to deliberately avoid in future iterations:

- Do not add a separate poll, vote, or "cast preference" surface.
- Do not introduce payment, room selection, or itinerary detail beyond
  the handoff modal. That is a separate product surface.
- Do not introduce a soft hold or inventory hold. The line between
  "decision visibility" and "transaction mechanics" is the strategic
  boundary of the feature.
- Do not over-decorate the empty state with illustrations or large
  icons. The empty state should feel polished but quiet.
- Do not auto-redirect the user to booking once the group is aligned. A
  deliberate human click is part of the product story.

---

## 14. Known simplifications

- **No router.** Navigation between screens is a `setScreen()` call. URL
  state is intentionally not modeled. This is faster to demo and easier
  to reason about.
- **No persistence.** Reload resets to seeded state. This is desirable
  for live demos because it makes the demo deterministic.
- **No live updates.** Reactions update only when the local presenter
  clicks. There is no multiplayer simulation. If a future demo needs
  this, simulate it with a `setTimeout` that flips a teammate's
  reaction.
- **No real authentication.** The "current user" is hardcoded to the
  first sample member.
- **Images are remote.** They depend on the Unsplash CDN being reachable
  at presentation time. If presenting on an unreliable network, swap
  these to bundled assets.
- **Only desktop layout.** The viewport meta is fixed at width=1280 and
  the prototype is not responsive below ~1024px. This is a deliberate
  scoping choice.
- **One detail surface.** The previous version used a right-side drawer
  for option detail. It was replaced by a centered modal because the
  drawer crowded the page during the demo.

---

## 15. How to run locally

Requirements:

- Node 18+ and npm.

Install and run:

```bash
npm install
npm run dev
```

Then open the URL Vite prints (`http://127.0.0.1:5173` by default).

Useful commands:

- `npm run build` — production build into `dist/`.
- `npm run preview` — preview the production build.
- `tsc --noEmit` — type check only.

Presenter notes:

- The demo is meant to be presented in this order: **Search → Add to
  group trip → View group trip → Dashboard → React → Continue to booking
  → Handoff modal.**
- Before presenting, reload the page once so the seeded state is fresh.
- The floating dev navigator is hidden by default. To enable it during
  rehearsal, append `?dev=1` to the URL, or press `Alt+Shift+D` on the
  page. Hide it again before going live to executives.

---

## File map

```
src/
  App.tsx                          screen orchestration, modals, dev nav
  main.tsx                         entry point
  index.css                        Tailwind layers and shared button classes
  data/mockData.ts                 group trip, members, hotel catalog, seeded reactions
  state/useTripStore.ts            store hook, ranking, readiness logic
  components/
    Avatar.tsx                     avatar, reaction avatar, avatar stack
    ConsensusMeter.tsx             stacked horizontal meter
    DemoNav.tsx                    floating dev navigator
    HandoffModal.tsx               centered handoff modal
    HeroConsensus.tsx              dashboard hero card for the leading option
    Icon.tsx                       small inline SVG icon set
    OptionDetailModal.tsx          centered option detail modal (Screen 4)
    OptionRow.tsx                  compact comparison row
    Toast.tsx                      bottom-centered toast
    TopNav.tsx                     Expedia-style global navigation
    TripHeader.tsx                 trip name, dates, members, status pill
    WhoNeedsPanel.tsx              minimal "Who still needs to weigh in?" panel
  screens/
    SearchResults.tsx              Screen 1
    EmptyDashboard.tsx             Screen 2
    Dashboard.tsx                  Screen 3
    ReadyToBook.tsx                Screen 5

docs/
  PROTOTYPE_NOTES.md               this file
```

---

## Closing reminder for future AI assistants

When extending this prototype, ask first whether the change makes the
group's direction more obvious or less obvious. If the answer is "less
obvious," the change should not ship in the demo. Clarity is the
product, not a polishing pass.
