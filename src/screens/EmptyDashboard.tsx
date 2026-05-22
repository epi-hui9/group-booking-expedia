import type { TripStore } from "../state/useTripStore";
import { TripHeader } from "../components/TripHeader";
import { groupTrip } from "../data/mockData";

const steps = [
  { n: "1", title: "Add options", body: "Add hotels or flights from Expedia search." },
  { n: "2", title: "Members react", body: "Each member reacts Yes or Not for me." },
  { n: "3", title: "See the group's direction", body: "The dashboard shows where consensus is forming." },
];

export function EmptyDashboard({ store }: { store: TripStore }) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-expedia-surface">
      <TripHeader
        onBack={() => store.setScreen("search")}
        subline={
          <>
            {groupTrip.destination} · {groupTrip.dates} · {groupTrip.guests}{" "}
            travelers
          </>
        }
      />

      <div className="mx-auto max-w-[1200px] px-8 py-10">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-display text-[28px] font-extrabold leading-tight text-expedia-ink">
            Add hotels or flights to start comparing options with your group.
          </h2>

          <div className="mt-6 rounded-2xl border border-expedia-line bg-white p-8 text-center shadow-card">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-expedia-mute">
              Group trip dashboard
            </div>
            <h3 className="mt-2 font-display text-[22px] font-extrabold text-expedia-ink">
              Nothing to compare yet
            </h3>
            <p className="mx-auto mt-2 max-w-[440px] text-[14px] leading-relaxed text-expedia-slate">
              Add options from Expedia search. Once members react, this page
              will show where the group is leaning.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => store.setScreen("search")}
                className="btn-primary"
              >
                Browse hotels
              </button>
              <button className="btn-secondary">Browse flights</button>
            </div>
          </div>

          <ol className="mt-8 grid grid-cols-3 gap-4">
            {steps.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-expedia-line bg-white p-4"
              >
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-expedia-blue-soft text-[12px] font-bold text-expedia-blue">
                    {s.n}
                  </span>
                  <div className="text-[14px] font-semibold text-expedia-ink">
                    {s.title}
                  </div>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-expedia-slate">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
