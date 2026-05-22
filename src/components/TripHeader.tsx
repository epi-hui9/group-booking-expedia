import { groupTrip, members } from "../data/mockData";
import { Avatar } from "./Avatar";
import { ChevronLeftIcon } from "./Icon";

export function TripHeader({
  subline,
  onBack,
  tone = "planning",
}: {
  subline?: React.ReactNode;
  onBack: () => void;
  tone?: "planning" | "ready";
}) {
  return (
    <div className="border-b border-expedia-line bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-5">
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-expedia-slate transition-colors hover:bg-expedia-line-soft hover:text-expedia-ink"
            aria-label="Back"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-[24px] font-extrabold leading-tight text-expedia-ink">
                {groupTrip.name}
              </h1>
              <span className="text-expedia-mute">·</span>
              <span className="font-display text-[18px] font-semibold text-expedia-slate">
                {groupTrip.dates}
              </span>
            </div>
            <div className="mt-1 text-[13.5px] text-expedia-slate">
              {subline ?? (
                <>
                  {groupTrip.destination} · {groupTrip.guests} travelers
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-2">
            {members.map((m) => (
              <div key={m.id} className="rounded-full ring-2 ring-white">
                <Avatar member={m} size="md" />
              </div>
            ))}
          </div>
          <span
            className={[
              "ml-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
              tone === "ready"
                ? "bg-expedia-success-soft text-expedia-success"
                : "bg-expedia-blue-soft text-expedia-blue",
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                tone === "ready" ? "bg-expedia-success" : "bg-expedia-blue",
              ].join(" ")}
            />
            {tone === "ready" ? "Ready to book" : "Planning"}
          </span>
        </div>
      </div>
    </div>
  );
}
