import { useEffect, useState } from "react";
import { members } from "../data/mockData";
import type { ReactionValue } from "../data/mockData";
import { ReactionAvatar } from "./Avatar";
import { ConsensusMeter } from "./ConsensusMeter";
import {
  CheckIcon,
  MapPinIcon,
  QuestionIcon,
  StarIcon,
  XIcon,
} from "./Icon";
import type { RankedOption } from "../state/useTripStore";

export function OptionDetailModal({
  option,
  currentUserId,
  onClose,
  onReact,
}: {
  option: RankedOption;
  currentUserId: string;
  onClose: () => void;
  onReact: (value: ReactionValue) => void;
}) {
  const [saving, setSaving] = useState<null | ReactionValue>(null);
  const myReaction = option.reactionsByMember[currentUserId] ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const react = (value: ReactionValue) => {
    setSaving(value);
    setTimeout(() => {
      onReact(value);
      setSaving(null);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-expedia-navy-deep/40 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-hero animate-pop">
        <div className="relative h-[220px] overflow-hidden">
          <img
            src={option.image}
            alt={option.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-expedia-ink shadow-card transition-transform hover:scale-105"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <h2 className="font-display text-[22px] font-extrabold leading-tight">
              {option.name}
            </h2>
            <div className="mt-1 flex items-center gap-3 text-[13px] text-white/90">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 font-semibold backdrop-blur">
                <StarIcon size={11} className="text-expedia-yellow" />
                {option.rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPinIcon size={12} /> {option.location}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-baseline justify-between">
            <div className="font-display text-[24px] font-extrabold leading-none text-expedia-ink">
              ${option.pricePerNight}
              <span className="ml-1 text-sm font-semibold text-expedia-slate">
                / night
              </span>
            </div>
            <div className="text-[12px] text-expedia-slate">
              ${option.pricePerNight * 3} total · 3 nights
            </div>
          </div>

          <p className="mt-3 text-[13.5px] leading-relaxed text-expedia-slate">
            {option.description}
          </p>

          <div className="mt-5 rounded-xl border border-expedia-line bg-expedia-surface p-4">
            <div className="flex items-center justify-between text-[12px] font-semibold text-expedia-slate">
              <span>Group reactions</span>
              <span>
                {option.yes} Yes · {option.not} Not for me · {option.none} no
                reaction yet
              </span>
            </div>
            <div className="mt-2">
              <ConsensusMeter
                yes={option.yes}
                not={option.not}
                none={option.none}
                total={Object.keys(option.reactionsByMember).length}
              />
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              {members.map((m) => (
                <ReactionAvatar
                  key={m.id}
                  member={m}
                  reaction={option.reactionsByMember[m.id] ?? null}
                  size="sm"
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-expedia-mute">
              Your reaction
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => react(myReaction === "yes" ? null : "yes")}
                disabled={!!saving}
                className={[
                  "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border text-[13.5px] font-semibold transition-colors",
                  myReaction === "yes"
                    ? "border-expedia-success bg-expedia-success-soft text-expedia-success"
                    : "border-expedia-line bg-white text-expedia-ink hover:border-expedia-success/40 hover:text-expedia-success",
                ].join(" ")}
              >
                {saving === "yes" ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckIcon size={14} strokeWidth={3} />
                    Yes
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  react(myReaction === "not_for_me" ? null : "not_for_me")
                }
                disabled={!!saving}
                className={[
                  "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border text-[13.5px] font-semibold transition-colors",
                  myReaction === "not_for_me"
                    ? "border-expedia-warn bg-expedia-warn-soft text-expedia-warn"
                    : "border-expedia-line bg-white text-expedia-ink hover:border-expedia-warn/40 hover:text-expedia-warn",
                ].join(" ")}
              >
                {saving === "not_for_me" ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving…
                  </>
                ) : (
                  <>
                    <QuestionIcon size={14} />
                    Not for me
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-[12.5px] text-expedia-slate">
              You can change your reaction anytime before booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
