import { members } from "../data/mockData";
import type { Member, ReactionValue } from "../data/mockData";
import { Avatar } from "./Avatar";
import { BellIcon, CheckIcon } from "./Icon";
import type { RankedOption } from "../state/useTripStore";

type Standing =
  | { kind: "no_reaction" }
  | { kind: "not_for_me"; on: RankedOption };

function memberStanding(
  member: Member,
  ranked: RankedOption[],
  leading?: RankedOption,
): Standing | null {
  const leadingReaction: ReactionValue =
    leading?.reactionsByMember[member.id] ?? null;
  if (leadingReaction === "yes") return null;
  if (leadingReaction === "not_for_me" && leading) {
    return { kind: "not_for_me", on: leading };
  }
  const onAny = ranked.find(
    (o) => o.reactionsByMember[member.id] === "not_for_me",
  );
  if (onAny) return { kind: "not_for_me", on: onAny };
  return { kind: "no_reaction" };
}

export function WhoNeedsPanel({
  ranked,
  remindedMemberIds,
  onRemind,
}: {
  ranked: RankedOption[];
  remindedMemberIds: string[];
  onRemind: (memberId: string) => void;
}) {
  const leading = ranked.find((r) => r.isLeading);

  const rows = members
    .map((m) => ({ m, standing: memberStanding(m, ranked, leading) }))
    .filter((r): r is { m: Member; standing: Standing } => Boolean(r.standing));

  if (rows.length === 0) {
    return (
      <div className="surface p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-expedia-mute">
          Who still needs to weigh in?
        </div>
        <p className="mt-2 text-[13px] text-expedia-slate">
          Everyone has weighed in on the leading option.
        </p>
      </div>
    );
  }

  const anyNoReaction = rows.some((r) => r.standing.kind === "no_reaction");

  return (
    <div className="surface p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-expedia-mute">
        Who still needs to weigh in?
      </div>
      {anyNoReaction && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-expedia-slate">
          Send a gentle reminder so the group can move forward.
        </p>
      )}
      <ul className="mt-3 space-y-2.5">
        {rows.map(({ m, standing }) => {
          const reminded = remindedMemberIds.includes(m.id);
          const isNoReaction = standing.kind === "no_reaction";
          const label = isNoReaction
            ? "No reaction yet"
            : `Not for me · ${standing.on.name}`;
          const tone = isNoReaction
            ? "text-expedia-mute"
            : "text-expedia-warn";
          return (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar member={m} size="sm" />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-expedia-ink">
                    {m.name}
                  </div>
                  <div className={`text-[12px] font-medium ${tone}`}>
                    {label}
                  </div>
                </div>
              </div>
              {isNoReaction &&
                (reminded ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-expedia-success-soft px-2.5 py-1 text-[11.5px] font-semibold text-expedia-success">
                    <CheckIcon size={11} strokeWidth={3} />
                    Reminder sent
                  </span>
                ) : (
                  <button
                    onClick={() => onRemind(m.id)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-expedia-line bg-white px-2.5 py-1 text-[11.5px] font-semibold text-expedia-blue transition-colors hover:border-expedia-blue/40 hover:bg-expedia-blue-soft"
                  >
                    <BellIcon size={11} />
                    Remind
                  </button>
                ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
