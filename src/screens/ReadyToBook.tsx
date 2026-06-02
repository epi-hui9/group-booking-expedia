import { useMemo, useState } from "react";
import {
  groupTrip,
  members,
  TRIP_NIGHTS,
  totalForStay,
} from "../data/mockData";
import type { TripStore } from "../state/useTripStore";
import { rankOptions } from "../state/useTripStore";
import { TripHeader } from "../components/TripHeader";
import { ReactionAvatar } from "../components/Avatar";
import { ConsensusMeter } from "../components/ConsensusMeter";
import { HotelImage } from "../components/HotelImage";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  MapPinIcon,
  ShieldIcon,
  StarIcon,
  UsersIcon,
} from "../components/Icon";

export function ReadyToBook({ store }: { store: TripStore }) {
  const ranked = useMemo(() => rankOptions(store.options), [store.options]);
  const leading = ranked.find((r) => r.isLeading) ?? ranked[0];
  const [handedOff, setHandedOff] = useState(false);

  if (!leading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-expedia-surface">
        <TripHeader onBack={() => store.setScreen("dashboard")} />
        <div className="mx-auto max-w-[720px] px-8 py-16 text-center">
          <h2 className="font-display text-[24px] font-extrabold text-expedia-ink">
            Not quite ready yet
          </h2>
          <p className="mt-2 text-sm text-expedia-slate">
            A leading option will appear once at least one teammate beyond the
            proposer reacts Yes.
          </p>
          <button
            onClick={() => store.setScreen("dashboard")}
            className="btn-primary mt-6"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-expedia-surface">
      <TripHeader tone="ready" onBack={() => store.setScreen("dashboard")} />

      <div className="mx-auto max-w-[1040px] px-8 py-10">
        <div className="mb-6">
          <h2 className="font-display text-[30px] font-extrabold leading-[1.15] text-expedia-ink">
            The group is ready to move forward with{" "}
            <span className="relative whitespace-nowrap">
              {leading.name}
              <span className="absolute -bottom-1 left-0 right-0 h-2 bg-expedia-yellow/45" />
            </span>
            .
          </h2>
          <p className="mt-2 text-[15px] text-expedia-slate">
            {leading.yes} of {members.length} members support this option. The
            group still takes a deliberate action to book.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-expedia-line bg-white shadow-hero">
          <div className="flex">
            <div className="relative h-[300px] w-[420px] shrink-0 overflow-hidden">
              <HotelImage src={leading.image} alt={leading.name} />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-expedia-success px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                <CheckIcon size={11} strokeWidth={3} />
                Group aligned
              </div>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <h3 className="font-display text-[22px] font-extrabold leading-tight text-expedia-ink">
                {leading.name}
              </h3>
              <div className="mt-1.5 flex items-center gap-3 text-[13px] text-expedia-slate">
                <span className="inline-flex items-center gap-1 rounded-md bg-expedia-blue-soft px-1.5 py-0.5 text-[12px] font-semibold text-expedia-blue">
                  <StarIcon size={11} className="text-expedia-yellow" />
                  {leading.rating.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon size={12} /> {leading.location}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Detail
                  icon={<CalendarIcon size={13} />}
                  label="Dates"
                  value={groupTrip.dates}
                />
                <Detail
                  icon={<UsersIcon size={13} />}
                  label="Travelers"
                  value={`${groupTrip.guests} guests`}
                />
                <Detail
                  icon={<MapPinIcon size={13} />}
                  label="Destination"
                  value={groupTrip.destination}
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-[12px] font-semibold text-expedia-slate">
                  <span>Group reactions</span>
                  <span>
                    {leading.yes} Yes · {leading.not} Not for me ·{" "}
                    {leading.none} no reaction yet
                  </span>
                </div>
                <div className="mt-2">
                  <ConsensusMeter
                    yes={leading.yes}
                    not={leading.not}
                    none={leading.none}
                    total={Object.keys(leading.reactionsByMember).length}
                    size="lg"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2.5">
                  {members.map((m) => (
                    <ReactionAvatar
                      key={m.id}
                      member={m}
                      reaction={leading.reactionsByMember[m.id] ?? null}
                      size="sm"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between pt-6">
                <div>
                  <div className="font-display text-[28px] font-extrabold leading-none text-expedia-ink">
                    ${leading.pricePerNight}
                    <span className="ml-1 text-sm font-semibold text-expedia-slate">
                      / night
                    </span>
                  </div>
                  <div className="mt-0.5 text-[12.5px] font-medium text-expedia-slate">
                    ${totalForStay(leading.pricePerNight).toLocaleString()}{" "}
                    total for {TRIP_NIGHTS} nights · {groupTrip.guests} guests
                  </div>
                </div>
                {handedOff ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-expedia-success-soft px-4 py-2.5 text-sm font-semibold text-expedia-success">
                    <CheckCircleIcon size={16} />
                    Handed off to checkout
                  </span>
                ) : (
                  <button
                    onClick={() => setHandedOff(true)}
                    className="btn-primary"
                  >
                    Continue to checkout
                    <ArrowRightIcon size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {handedOff ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-expedia-success/30 bg-expedia-success-soft/50 p-5 animate-fadeIn">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-expedia-success text-white">
              <CheckCircleIcon size={16} />
            </span>
            <div className="text-[13.5px] leading-relaxed text-expedia-slate">
              <span className="font-semibold text-expedia-ink">
                The group is aligned and moving forward together.
              </span>{" "}
              Next, the group reviews rooms, taxes, and payment details in
              Expedia checkout. No one is charged yet — the final booking stays
              a deliberate group action.
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-expedia-line bg-white p-5">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-expedia-blue-soft text-expedia-blue">
              <ShieldIcon size={15} />
            </span>
            <div className="text-[13.5px] leading-relaxed text-expedia-slate">
              <span className="font-semibold text-expedia-ink">
                Alignment is visible. Commitment is still yours.
              </span>{" "}
              You&rsquo;ll review rooms, taxes, and payment details next. The
              dashboard never auto-books — it only helps the group see where
              consensus is forming.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-expedia-line bg-white p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-expedia-mute">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-[14px] font-semibold text-expedia-ink">
        {value}
      </div>
    </div>
  );
}
