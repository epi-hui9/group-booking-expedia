import { useCallback, useMemo, useState } from "react";
import {
  currentUserId,
  hotelCatalog,
  initialAddedOptionIds,
  initialReactions,
  initialReasons,
  members,
  type HotelOption,
  type NotForMeReason,
  type OptionWithReactions,
  type ReactionMap,
  type ReasonMap,
  type ReactionValue,
} from "../data/mockData";

export type Screen = "search" | "empty" | "dashboard" | "ready";

export function useTripStore() {
  const [screen, setScreen] = useState<Screen>("search");
  const [addedIds, setAddedIds] = useState<string[]>(initialAddedOptionIds);
  const [reactions, setReactions] =
    useState<Record<string, ReactionMap>>(initialReactions);
  const [reasons, setReasons] =
    useState<Record<string, ReasonMap>>(initialReasons);
  const [toast, setToast] = useState<{
    id: number;
    title: string;
    action?: "view_trip" | null;
  } | null>(null);
  const [detailOptionId, setDetailOptionId] = useState<string | null>(null);
  const [remindedMemberIds, setRemindedMemberIds] = useState<string[]>([]);

  const addOption = useCallback((hotelId: string) => {
    const hotel = hotelCatalog.find((h) => h.id === hotelId);
    if (!hotel) return;
    setAddedIds((ids) => (ids.includes(hotelId) ? ids : [...ids, hotelId]));
    setReactions((prev) => {
      if (prev[hotelId]) return prev;
      const blank: ReactionMap = Object.fromEntries(
        members.map((m) => [m.id, null]),
      );
      blank[currentUserId] = "yes";
      return { ...prev, [hotelId]: blank };
    });
    setToast({
      id: Date.now(),
      title: `${hotel.name} added to Vegas Weekend.`,
      action: "view_trip",
    });
  }, []);

  const sendReminder = useCallback((memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    setRemindedMemberIds((ids) =>
      ids.includes(memberId) ? ids : [...ids, memberId],
    );
    setToast({
      id: Date.now(),
      title: `Reminder sent to ${member.name}.`,
      action: null,
    });
  }, []);

  const setReaction = useCallback(
    (optionId: string, memberId: string, value: ReactionValue) => {
      setReactions((prev) => {
        const map = { ...(prev[optionId] ?? {}) };
        map[memberId] = value;
        return { ...prev, [optionId]: map };
      });
      if (value !== "not_for_me") {
        setReasons((prev) => {
          if (!prev[optionId]?.[memberId]) return prev;
          const map = { ...prev[optionId] };
          delete map[memberId];
          return { ...prev, [optionId]: map };
        });
      }
    },
    [],
  );

  const setNotForMeReason = useCallback(
    (optionId: string, memberId: string, reason: NotForMeReason | null) => {
      setReasons((prev) => {
        const map = { ...(prev[optionId] ?? {}) };
        if (reason === null) {
          delete map[memberId];
        } else {
          map[memberId] = reason;
        }
        return { ...prev, [optionId]: map };
      });
    },
    [],
  );

  const removeOption = useCallback((hotelId: string) => {
    const hotel = hotelCatalog.find((h) => h.id === hotelId);
    setAddedIds((ids) => ids.filter((id) => id !== hotelId));
    setReactions((prev) => {
      const next = { ...prev };
      delete next[hotelId];
      return next;
    });
    setReasons((prev) => {
      const next = { ...prev };
      delete next[hotelId];
      return next;
    });
    setDetailOptionId((current) => (current === hotelId ? null : current));
    setToast({
      id: Date.now(),
      title: hotel
        ? `${hotel.name} removed from Vegas Weekend.`
        : "Option removed from Vegas Weekend.",
      action: null,
    });
  }, []);

  const resetTrip = useCallback(() => {
    setAddedIds([]);
    setReactions({});
    setReasons({});
    setRemindedMemberIds([]);
  }, []);

  const restoreDemo = useCallback(() => {
    setAddedIds(initialAddedOptionIds);
    setReactions(initialReactions);
    setReasons(initialReasons);
    setRemindedMemberIds([]);
  }, []);

  const options: OptionWithReactions[] = useMemo(() => {
    return addedIds
      .map((id) => hotelCatalog.find((h) => h.id === id))
      .filter((h): h is HotelOption => Boolean(h))
      .map((hotel) => ({
        ...hotel,
        reactionsByMember:
          reactions[hotel.id] ??
          Object.fromEntries(members.map((m) => [m.id, null])),
        reasonsByMember: reasons[hotel.id] ?? {},
      }));
  }, [addedIds, reactions, reasons]);

  const dismissToast = useCallback(() => setToast(null), []);

  return {
    screen,
    setScreen,
    addedIds,
    addOption,
    removeOption,
    options,
    setReaction,
    setNotForMeReason,
    toast,
    dismissToast,
    detailOptionId,
    setDetailOptionId,
    resetTrip,
    restoreDemo,
    remindedMemberIds,
    sendReminder,
  };
}

export type TripStore = ReturnType<typeof useTripStore>;

export function summarizeReactions(option: OptionWithReactions) {
  const entries = Object.entries(option.reactionsByMember);
  const yes = entries.filter(([, v]) => v === "yes").length;
  const not = entries.filter(([, v]) => v === "not_for_me").length;
  const none = entries.filter(([, v]) => v === null).length;
  return { yes, not, none, total: entries.length };
}

export type RankedOption = OptionWithReactions & {
  rank: number;
  isLeading: boolean;
  isPending: boolean;
  isTie: boolean;
  yes: number;
  not: number;
  none: number;
};

export function rankOptions(options: OptionWithReactions[]): RankedOption[] {
  const scored = options.map((o) => {
    const { yes, not, none } = summarizeReactions(o);
    const supportBeyondProposer = Object.entries(o.reactionsByMember).some(
      ([memberId, v]) => v === "yes" && memberId !== o.addedBy,
    );
    return {
      option: o,
      yes,
      not,
      none,
      supportBeyondProposer,
      available: o.availability === "available",
    };
  });

  const eligible = scored.filter(
    (s) => s.available && s.supportBeyondProposer,
  );

  const sorted = [...scored].sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    if (a.yes !== b.yes) return b.yes - a.yes;
    if (a.not !== b.not) return a.not - b.not;
    return 0;
  });

  let leadingId: string | null = null;
  if (eligible.length > 0) {
    const top = [...eligible].sort((a, b) => {
      if (a.yes !== b.yes) return b.yes - a.yes;
      return a.not - b.not;
    })[0];
    leadingId = top.option.id;
  }

  const topYes = sorted[0]?.yes ?? 0;
  const tieCount = sorted.filter(
    (s) => s.yes === topYes && topYes > 0 && s.available,
  ).length;

  return sorted.map((s, i) => ({
    ...s.option,
    rank: i + 1,
    yes: s.yes,
    not: s.not,
    none: s.none,
    isLeading: s.option.id === leadingId,
    isPending: !s.supportBeyondProposer && s.available,
    isTie: tieCount > 1 && s.yes === topYes && s.available,
  }));
}

export function getReadiness(options: OptionWithReactions[]) {
  const ranked = rankOptions(options);
  const leading = ranked.find((r) => r.isLeading);
  if (!leading) {
    return {
      status: "pending" as const,
      label: "Waiting for reactions",
      ranked,
      leading: null,
    };
  }
  const yes = leading.yes;
  const total = Object.keys(leading.reactionsByMember).length;
  const none = leading.none;
  if (yes >= total - 1 && none <= 1) {
    return {
      status: "ready" as const,
      label: "Ready to move forward",
      ranked,
      leading,
    };
  }
  if (yes >= Math.ceil(total / 2)) {
    return {
      status: "close" as const,
      label: "Close to ready",
      ranked,
      leading,
    };
  }
  return {
    status: "forming" as const,
    label: "Consensus forming",
    ranked,
    leading,
  };
}

export { currentUserId };
