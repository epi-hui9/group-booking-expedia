import { useEffect, useRef, useState } from "react";
import type { ReactionValue } from "../data/mockData";
import { memberById, TRIP_NIGHTS, totalForStay } from "../data/mockData";
import { ConsensusMeter } from "./ConsensusMeter";
import { HotelImage } from "./HotelImage";
import {
  CheckIcon,
  ChevronRightIcon,
  DotsIcon,
  QuestionIcon,
  StarIcon,
  TrashIcon,
} from "./Icon";
import type { RankedOption } from "../state/useTripStore";

function statusLabel(o: RankedOption) {
  if (o.isLeading) return { label: "Leading", tone: "leading" as const };
  if (o.isPending) return { label: "Pending reactions", tone: "pending" as const };
  if (o.isTie) return { label: "Still close", tone: "close" as const };
  if (o.not > o.yes && o.yes > 0)
    return { label: "Needs more input", tone: "muted" as const };
  if (o.none >= Math.ceil(Object.keys(o.reactionsByMember).length / 2))
    return { label: "Needs more input", tone: "muted" as const };
  return { label: "Still close", tone: "close" as const };
}

const toneStyles = {
  leading: "bg-expedia-yellow/20 text-[#7A5400]",
  close: "bg-expedia-blue-soft text-expedia-blue",
  pending: "bg-expedia-warn-soft text-expedia-warn",
  muted: "bg-expedia-line-soft text-expedia-slate",
};

export function OptionRow({
  option,
  currentUserId,
  onReact,
  onOpen,
  onRemove,
  canRemove,
}: {
  option: RankedOption;
  currentUserId: string;
  onReact: (v: ReactionValue) => void;
  onOpen: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const myReaction = option.reactionsByMember[currentUserId] ?? null;
  const status = statusLabel(option);

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirming(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleRemove = () => {
    setMenuOpen(false);
    setConfirming(false);
    setRemoving(true);
    window.setTimeout(onRemove, 260);
  };

  const total = totalForStay(option.pricePerNight);

  const reasonEntries = Object.entries(option.reasonsByMember);

  return (
    <article
      className={[
        "flex items-stretch gap-4 rounded-2xl border bg-white p-3 transition-all duration-200",
        removing
          ? "scale-[0.98] opacity-0"
          : option.isLeading
            ? "border-expedia-yellow shadow-card"
            : "border-expedia-line hover:shadow-card",
      ].join(" ")}
    >
      <button
        onClick={onOpen}
        className="relative h-[108px] w-[148px] shrink-0 overflow-hidden rounded-xl"
      >
        <HotelImage src={option.image} alt={option.name} />
      </button>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-expedia-mute">
                #{option.rank}
              </span>
              <button
                onClick={onOpen}
                className="text-left font-display text-[16px] font-bold leading-tight text-expedia-ink hover:underline"
              >
                {option.name}
              </button>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  toneStyles[status.tone],
                ].join(" ")}
              >
                {status.label}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-[12.5px] text-expedia-slate">
              <span className="inline-flex items-center gap-1 font-semibold text-expedia-blue">
                <StarIcon size={10} className="text-expedia-yellow" />
                {option.rating.toFixed(1)}
              </span>
              <span className="font-semibold text-expedia-ink">
                ${option.pricePerNight}
                <span className="ml-0.5 font-medium text-expedia-slate">
                  /night
                </span>
              </span>
              <span className="text-expedia-mute">
                ${total.toLocaleString()} total · {TRIP_NIGHTS} nights
              </span>
              <span>{option.location}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              onClick={onOpen}
              className="rounded-full p-1.5 text-expedia-mute transition-colors hover:bg-expedia-line-soft hover:text-expedia-ink"
              aria-label="Open details"
            >
              <ChevronRightIcon size={16} />
            </button>
            {canRemove && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => {
                    setMenuOpen((v) => !v);
                    setConfirming(false);
                  }}
                  className={[
                    "rounded-full p-1.5 transition-colors",
                    menuOpen
                      ? "bg-expedia-line-soft text-expedia-ink"
                      : "text-expedia-mute hover:bg-expedia-line-soft hover:text-expedia-ink",
                  ].join(" ")}
                  aria-label="Option actions"
                >
                  <DotsIcon size={16} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-9 z-20 w-[232px] overflow-hidden rounded-xl border border-expedia-line bg-white p-1 shadow-cardHover animate-pop">
                    {confirming ? (
                      <div className="p-2">
                        <p className="px-1 text-[12.5px] leading-snug text-expedia-slate">
                          Remove{" "}
                          <span className="font-semibold text-expedia-ink">
                            {option.name}
                          </span>{" "}
                          from the group trip?
                        </p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            onClick={handleRemove}
                            className="flex-1 rounded-lg bg-expedia-ink px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-expedia-navy-deep"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => {
                              setConfirming(false);
                              setMenuOpen(false);
                            }}
                            className="flex-1 rounded-lg border border-expedia-line px-3 py-1.5 text-[12.5px] font-semibold text-expedia-ink transition-colors hover:bg-expedia-line-soft"
                          >
                            Keep
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            onOpen();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-expedia-ink transition-colors hover:bg-expedia-line-soft"
                        >
                          <ChevronRightIcon size={14} />
                          View details
                        </button>
                        <button
                          onClick={() => setConfirming(true)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-expedia-slate transition-colors hover:bg-expedia-line-soft hover:text-expedia-ink"
                        >
                          <TrashIcon size={14} />
                          Remove from trip
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <ConsensusMeter
              yes={option.yes}
              not={option.not}
              none={option.none}
              total={Object.keys(option.reactionsByMember).length}
              size="sm"
            />
            <div className="mt-1 text-[12px] text-expedia-slate">
              {option.yes} Yes · {option.not} Not for me · {option.none} no
              reaction yet
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() => onReact(myReaction === "yes" ? null : "yes")}
              className={[
                "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[12.5px] font-semibold transition-colors",
                myReaction === "yes"
                  ? "border-expedia-success bg-expedia-success-soft text-expedia-success"
                  : "border-expedia-line bg-white text-expedia-ink hover:border-expedia-success/40 hover:text-expedia-success",
              ].join(" ")}
            >
              <CheckIcon size={12} strokeWidth={3} />
              Yes
            </button>
            <button
              onClick={() =>
                onReact(myReaction === "not_for_me" ? null : "not_for_me")
              }
              className={[
                "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[12.5px] font-semibold transition-colors",
                myReaction === "not_for_me"
                  ? "border-expedia-warn bg-expedia-warn-soft text-expedia-warn"
                  : "border-expedia-line bg-white text-expedia-ink hover:border-expedia-warn/40 hover:text-expedia-warn",
              ].join(" ")}
            >
              <QuestionIcon size={12} />
              Not for me
            </button>
          </div>
        </div>

        {reasonEntries.length > 0 && (
          <button
            onClick={onOpen}
            className="mt-2.5 flex w-full items-start gap-2 rounded-xl border border-expedia-line bg-expedia-surface px-3 py-2 text-left transition-colors hover:border-expedia-warn/30"
          >
            <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-expedia-warn">
              Why not for me
            </span>
            <span className="flex flex-1 flex-wrap items-center gap-1.5">
              {reasonEntries.slice(0, 2).map(([memberId, reason]) => (
                <span
                  key={memberId}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11.5px] font-medium text-expedia-slate ring-1 ring-expedia-line"
                >
                  <span className="font-semibold text-expedia-ink">
                    {memberById(memberId).name}
                  </span>
                  · {reason.chip}
                </span>
              ))}
              {reasonEntries.length > 2 && (
                <span className="text-[11.5px] font-medium text-expedia-mute">
                  +{reasonEntries.length - 2} more
                </span>
              )}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}
