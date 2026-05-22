import { useMemo } from "react";
import {
  currentUserId,
  groupTrip,
  members,
} from "../data/mockData";
import type { TripStore } from "../state/useTripStore";
import { getReadiness, rankOptions } from "../state/useTripStore";
import { TripHeader } from "../components/TripHeader";
import { HeroConsensus } from "../components/HeroConsensus";
import { OptionRow } from "../components/OptionRow";
import { WhoNeedsPanel } from "../components/WhoNeedsPanel";
import { ArrowRightIcon, PlusIcon } from "../components/Icon";

export function Dashboard({ store }: { store: TripStore }) {
  const ranked = useMemo(() => rankOptions(store.options), [store.options]);
  const readiness = useMemo(() => getReadiness(store.options), [store.options]);
  const leading = ranked.find((r) => r.isLeading);

  const total = members.length;

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

      <div className="mx-auto max-w-[1200px] px-8 py-8">
        <div className="mb-6">
          {leading ? (
            <>
              <h2 className="font-display text-[32px] font-extrabold leading-[1.15] text-expedia-ink">
                The group is leaning toward{" "}
                <span className="relative whitespace-nowrap">
                  {leading.name}
                  <span className="absolute -bottom-1 left-0 right-0 h-2 bg-expedia-yellow/45" />
                </span>
                .
              </h2>
              <p className="mt-2 text-[15px] text-expedia-slate">
                {leading.yes} of {total} members support this option
                {leading.not > 0 && (
                  <>
                    {" "}
                    · {leading.not} not for me
                  </>
                )}
                {leading.none > 0 && (
                  <>
                    {" "}
                    · {leading.none} not yet weighed in
                  </>
                )}
                .
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-[28px] font-extrabold leading-tight text-expedia-ink">
                Waiting for the group to weigh in.
              </h2>
              <p className="mt-2 text-[14px] text-expedia-slate">
                A clear leader will appear after at least one more Yes
                reaction.
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <main className="col-span-12 space-y-6 lg:col-span-8">
            {leading && (
              <HeroConsensus
                leading={leading}
                onContinue={() => store.setScreen("ready")}
                onOpenDetail={() => store.setDetailOptionId(leading.id)}
              />
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-[16px] font-bold text-expedia-ink">
                  All options
                  <span className="ml-2 text-[13px] font-medium text-expedia-slate">
                    Ranked by group support
                  </span>
                </h3>
                <button
                  onClick={() => store.setScreen("search")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-expedia-blue hover:underline"
                >
                  <PlusIcon size={14} />
                  Add option
                </button>
              </div>
              <div className="space-y-3">
                {ranked.map((o) => (
                  <OptionRow
                    key={o.id}
                    option={o}
                    currentUserId={currentUserId}
                    onReact={(v) => store.setReaction(o.id, currentUserId, v)}
                    onOpen={() => store.setDetailOptionId(o.id)}
                  />
                ))}
              </div>
            </div>
          </main>

          <aside className="col-span-12 space-y-5 lg:col-span-4">
            <WhoNeedsPanel
              ranked={ranked}
              remindedMemberIds={store.remindedMemberIds}
              onRemind={store.sendReminder}
            />

            {leading && readiness.status !== "pending" && (
              <div className="surface p-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-expedia-mute">
                  Next step
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-expedia-slate">
                  {readiness.status === "ready"
                    ? "The group is ready to move forward. You can continue to booking when it feels right."
                    : "A clear leader is emerging. Continue when the group is ready."}
                </p>
                <button
                  onClick={() => store.setScreen("ready")}
                  className="btn-primary mt-4 w-full"
                >
                  Continue to booking
                  <ArrowRightIcon size={14} />
                </button>
                <p className="mt-2 text-center text-[11.5px] text-expedia-mute">
                  No one is charged yet.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
