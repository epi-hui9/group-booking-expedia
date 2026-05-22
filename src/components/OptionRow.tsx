import type { ReactionValue } from "../data/mockData";
import { ConsensusMeter } from "./ConsensusMeter";
import {
  CheckIcon,
  ChevronRightIcon,
  QuestionIcon,
  StarIcon,
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
}: {
  option: RankedOption;
  currentUserId: string;
  onReact: (v: ReactionValue) => void;
  onOpen: () => void;
}) {
  const myReaction = option.reactionsByMember[currentUserId] ?? null;
  const status = statusLabel(option);

  return (
    <article
      className={[
        "flex items-stretch gap-4 rounded-2xl border bg-white p-3 transition-shadow",
        option.isLeading
          ? "border-expedia-yellow shadow-card"
          : "border-expedia-line hover:shadow-card",
      ].join(" ")}
    >
      <button
        onClick={onOpen}
        className="relative h-[108px] w-[148px] shrink-0 overflow-hidden rounded-xl"
      >
        <img
          src={option.image}
          alt={option.name}
          className="h-full w-full object-cover"
        />
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
              <span>{option.location}</span>
            </div>
          </div>
          <button
            onClick={onOpen}
            className="shrink-0 rounded-full p-1.5 text-expedia-mute transition-colors hover:bg-expedia-line-soft hover:text-expedia-ink"
            aria-label="Open details"
          >
            <ChevronRightIcon size={16} />
          </button>
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
      </div>
    </article>
  );
}
