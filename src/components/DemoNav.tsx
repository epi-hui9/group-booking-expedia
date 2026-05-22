import { useState } from "react";
import type { Screen } from "../state/useTripStore";

const steps: { id: Screen; label: string; description: string }[] = [
  {
    id: "search",
    label: "1 · Search",
    description: "Add hotels to the group trip",
  },
  {
    id: "empty",
    label: "2 · Empty trip",
    description: "Initial group workspace",
  },
  {
    id: "dashboard",
    label: "3 · Reacting",
    description: "Where the group stands",
  },
  {
    id: "ready",
    label: "4 · Ready to book",
    description: "Aligned and confident",
  },
];

export function DemoNav({
  screen,
  onNavigate,
  onOpenDrawer,
}: {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  onOpenDrawer: () => void;
}) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-expedia-navy px-3.5 py-2 text-[12px] font-semibold text-white shadow-cardHover"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-expedia-yellow" />
        Demo flow
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 w-[320px] overflow-hidden rounded-2xl border border-expedia-navy/10 bg-white/95 shadow-cardHover backdrop-blur">
      <div className="flex items-center justify-between border-b border-expedia-line bg-expedia-navy px-4 py-2.5 text-white">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-expedia-yellow" />
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.18em]">
            Prototype flow
          </span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-[11px] font-semibold text-white/80 hover:text-white"
        >
          Hide
        </button>
      </div>
      <ol className="px-2 py-2">
        {steps.map((s) => {
          const active = s.id === screen;
          return (
            <li key={s.id}>
              <button
                onClick={() => onNavigate(s.id)}
                className={[
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                  active
                    ? "bg-expedia-navy/8 text-expedia-navy"
                    : "hover:bg-expedia-line/40",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold",
                    active
                      ? "bg-expedia-navy text-white"
                      : "bg-white text-expedia-slate ring-1 ring-expedia-line",
                  ].join(" ")}
                >
                  {s.label.split(" ")[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-expedia-ink">
                    {s.label.replace(/^\d+\s·\s/, "")}
                  </span>
                  <span className="block text-[11.5px] text-expedia-slate">
                    {s.description}
                  </span>
                </span>
                {active && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-expedia-navy">
                    Now
                  </span>
                )}
              </button>
            </li>
          );
        })}
        <li className="px-1 pt-1">
          <button
            onClick={onOpenDrawer}
            className="flex w-full items-center justify-between rounded-xl border border-dashed border-expedia-navy/20 px-3 py-2 text-left transition-colors hover:bg-expedia-navy/5"
          >
            <span>
              <span className="block text-[13px] font-semibold text-expedia-ink">
                Option detail drawer
              </span>
              <span className="block text-[11.5px] text-expedia-slate">
                React, change reaction, save state
              </span>
            </span>
            <span className="text-[11px] font-semibold text-expedia-navy">
              Preview
            </span>
          </button>
        </li>
      </ol>
    </div>
  );
}
