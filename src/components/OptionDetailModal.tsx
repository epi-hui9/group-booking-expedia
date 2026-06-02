import { useEffect, useState } from "react";
import { members, memberById, NOT_FOR_ME_REASONS } from "../data/mockData";
import type { NotForMeReason, ReactionValue } from "../data/mockData";
import { TRIP_NIGHTS, totalForStay } from "../data/mockData";
import { ReactionAvatar } from "./Avatar";
import { ConsensusMeter } from "./ConsensusMeter";
import { HotelImage } from "./HotelImage";
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
  onSetReason,
}: {
  option: RankedOption;
  currentUserId: string;
  onClose: () => void;
  onReact: (value: ReactionValue) => void;
  onSetReason: (reason: NotForMeReason | null) => void;
}) {
  const [saving, setSaving] = useState<null | ReactionValue>(null);
  const myReaction = option.reactionsByMember[currentUserId] ?? null;
  const myReason = option.reasonsByMember[currentUserId] ?? null;

  const [showReasonPicker, setShowReasonPicker] = useState(false);
  const [selectedChip, setSelectedChip] = useState<string | null>(
    myReason?.chip ?? null,
  );
  const [note, setNote] = useState(myReason?.note ?? "");

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
      if (value === "not_for_me") {
        setShowReasonPicker(true);
        setSelectedChip(null);
        setNote("");
      } else {
        setShowReasonPicker(false);
      }
    }, 300);
  };

  const submitReason = () => {
    if (!selectedChip) return;
    onSetReason({ chip: selectedChip, note: note.trim() || undefined });
    setShowReasonPicker(false);
  };

  const total = totalForStay(option.pricePerNight);

  const reasonEntries = Object.entries(option.reasonsByMember);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-expedia-navy-deep/40 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white shadow-hero animate-pop">
        <div className="relative h-[220px] overflow-hidden">
          <HotelImage src={option.image} alt={option.name} />
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
          <div className="flex items-end justify-between" data-cap="price">
            <div>
              <div className="font-display text-[24px] font-extrabold leading-none text-expedia-ink">
                ${option.pricePerNight}
                <span className="ml-1 text-sm font-semibold text-expedia-slate">
                  / night
                </span>
              </div>
              <div className="mt-1 text-[12.5px] font-medium text-expedia-slate">
                ${total.toLocaleString()} total for {TRIP_NIGHTS} nights · taxes
                &amp; fees included
              </div>
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

          {reasonEntries.length > 0 && (
            <div className="mt-4 rounded-xl border border-expedia-warn/25 bg-expedia-warn-soft/50 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-expedia-warn">
                Why not for me
              </div>
              <p className="mt-1 text-[12px] text-expedia-slate">
                Quiet, optional context so the organizer can see the tradeoff.
              </p>
              <ul className="mt-3 space-y-2.5">
                {reasonEntries.map(([memberId, reason]) => {
                  const member = memberById(memberId);
                  return (
                    <li key={memberId} className="flex items-start gap-2.5">
                      <span
                        className={[
                          "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                          member.color,
                        ].join(" ")}
                      >
                        {member.initials}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-expedia-ink">
                            {member.name}
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11.5px] font-medium text-expedia-warn ring-1 ring-expedia-warn/20">
                            {reason.chip}
                          </span>
                        </div>
                        {reason.note && (
                          <p className="mt-0.5 text-[12.5px] leading-snug text-expedia-slate">
                            “{reason.note}”
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

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

            {myReaction === "not_for_me" && !showReasonPicker && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-expedia-line bg-expedia-surface px-3.5 py-2.5">
                <div className="min-w-0 text-[12.5px] text-expedia-slate">
                  {myReason ? (
                    <>
                      Your note:{" "}
                      <span className="font-semibold text-expedia-ink">
                        {myReason.chip}
                      </span>
                    </>
                  ) : (
                    "Add a quick reason so the organizer understands the tradeoff."
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedChip(myReason?.chip ?? null);
                    setNote(myReason?.note ?? "");
                    setShowReasonPicker(true);
                  }}
                  className="shrink-0 text-[12.5px] font-semibold text-expedia-blue hover:underline"
                >
                  {myReason ? "Edit" : "Add a reason"}
                </button>
              </div>
            )}

            {myReaction === "not_for_me" && showReasonPicker && (
              <div className="mt-3 rounded-xl border border-expedia-line bg-white p-4">
                <div className="text-[13px] font-semibold text-expedia-ink">
                  What&rsquo;s the hesitation?
                </div>
                <p className="mt-0.5 text-[12px] text-expedia-slate">
                  Help the organizer understand the tradeoff. Optional.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {NOT_FOR_ME_REASONS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() =>
                        setSelectedChip((c) => (c === chip ? null : chip))
                      }
                      className={[
                        "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                        selectedChip === chip
                          ? "border-expedia-warn bg-expedia-warn-soft text-expedia-warn"
                          : "border-expedia-line bg-white text-expedia-slate hover:border-expedia-warn/40",
                      ].join(" ")}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a short note (optional)"
                  maxLength={90}
                  className="mt-3 w-full rounded-lg border border-expedia-line bg-expedia-surface px-3 py-2 text-[13px] text-expedia-ink outline-none transition-colors placeholder:text-expedia-mute focus:border-expedia-blue/50 focus:bg-white"
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowReasonPicker(false)}
                    className="rounded-full px-3.5 py-2 text-[12.5px] font-semibold text-expedia-slate transition-colors hover:bg-expedia-line-soft"
                  >
                    Skip
                  </button>
                  <button
                    onClick={submitReason}
                    disabled={!selectedChip}
                    className={[
                      "rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors",
                      selectedChip
                        ? "bg-expedia-blue text-white hover:bg-expedia-blue-hover"
                        : "cursor-not-allowed bg-expedia-line-soft text-expedia-mute",
                    ].join(" ")}
                  >
                    Share with organizer
                  </button>
                </div>
              </div>
            )}

            <p className="mt-3 text-[12.5px] text-expedia-slate">
              You can change your reaction anytime before booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
