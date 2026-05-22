import type { Member, ReactionValue } from "../data/mockData";
import { CheckIcon, QuestionIcon, XIcon } from "./Icon";

type Size = "xs" | "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

export function Avatar({
  member,
  size = "sm",
}: {
  member: Member;
  size?: Size;
}) {
  return (
    <div
      className={[
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold tracking-wide",
        sizeMap[size],
        member.color,
      ].join(" ")}
      title={member.name}
    >
      {member.initials}
    </div>
  );
}

const reactionRing: Record<Exclude<ReactionValue, null> | "none", string> = {
  yes: "ring-expedia-success",
  not_for_me: "ring-expedia-warn",
  none: "ring-expedia-line",
};

const reactionIconBg: Record<Exclude<ReactionValue, null> | "none", string> = {
  yes: "bg-expedia-success text-white",
  not_for_me: "bg-expedia-warn text-white",
  none: "bg-white text-expedia-mute border border-expedia-line",
};

export function ReactionAvatar({
  member,
  reaction,
  size = "sm",
}: {
  member: Member;
  reaction: ReactionValue;
  size?: Size;
}) {
  const key = (reaction ?? "none") as "yes" | "not_for_me" | "none";
  return (
    <div className="relative inline-flex">
      <div
        className={[
          "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold",
          sizeMap[size],
          reaction === null
            ? "bg-expedia-line-soft text-expedia-mute"
            : member.color,
          "ring-2 ring-offset-2 ring-offset-white",
          reactionRing[key],
        ].join(" ")}
        title={`${member.name}: ${key === "yes" ? "Yes" : key === "not_for_me" ? "Not for me" : "no reaction yet"}`}
      >
        {member.initials}
      </div>
      <span
        className={[
          "absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full",
          reactionIconBg[key],
        ].join(" ")}
      >
        {reaction === "yes" ? (
          <CheckIcon size={10} strokeWidth={3} />
        ) : reaction === "not_for_me" ? (
          <XIcon size={10} strokeWidth={3} />
        ) : (
          <QuestionIcon size={10} strokeWidth={2.5} />
        )}
      </span>
    </div>
  );
}

export function AvatarStack({
  members,
  max = 6,
  size = "sm",
}: {
  members: Member[];
  max?: number;
  size?: Size;
}) {
  const shown = members.slice(0, max);
  const overflow = members.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((m) => (
        <div
          key={m.id}
          className={[
            "rounded-full ring-2 ring-white",
            sizeMap[size],
            "inline-flex items-center justify-center font-semibold",
            m.color,
          ].join(" ")}
          title={m.name}
        >
          {m.initials}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={[
            "rounded-full ring-2 ring-white bg-white text-expedia-slate font-semibold inline-flex items-center justify-center",
            sizeMap[size],
          ].join(" ")}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
