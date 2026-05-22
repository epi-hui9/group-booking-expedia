import { useEffect } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  XIcon,
} from "./Icon";
import { groupTrip } from "../data/mockData";
import type { RankedOption } from "../state/useTripStore";

export function HandoffModal({
  option,
  onClose,
}: {
  option: RankedOption;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-expedia-navy-deep/45 backdrop-blur-[3px] animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-hero animate-pop">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-expedia-ink shadow-card transition-transform hover:scale-105"
        >
          <XIcon size={16} />
        </button>

        <div className="px-7 pb-6 pt-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-expedia-success-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-expedia-success">
            <CheckCircleIcon size={12} />
            Ready to continue
          </span>
          <h2 className="mt-3 font-display text-[22px] font-extrabold leading-tight text-expedia-ink">
            You&rsquo;ll review rooms, taxes, and payment details next.
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-expedia-slate">
            No one is charged yet. The group still takes a deliberate action
            to commit.
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-expedia-line bg-expedia-surface p-3">
            <img
              src={option.image}
              alt={option.name}
              className="h-16 w-24 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-semibold text-expedia-ink">
                {option.name}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[12.5px] text-expedia-slate">
                <span className="inline-flex items-center gap-1 font-semibold text-expedia-blue">
                  <StarIcon size={10} className="text-expedia-yellow" />
                  {option.rating.toFixed(1)}
                </span>
                <span>
                  ${option.pricePerNight}/night · {groupTrip.dates} ·{" "}
                  {groupTrip.guests} guests
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button onClick={onClose} className="btn-ghost">
              Back to dashboard
            </button>
            <button className="btn-primary">
              Continue to room selection
              <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
