import type { Screen } from "../state/useTripStore";

export function TopNav({
  screen,
  onNavigate,
}: {
  screen: Screen;
  onNavigate: (s: Screen) => void;
}) {
  const inGroup =
    screen === "empty" || screen === "dashboard" || screen === "ready";

  const item = (
    label: string,
    opts: { active?: boolean; accent?: boolean; onClick?: () => void } = {},
  ) => (
    <button
      onClick={opts.onClick}
      className={[
        "relative px-1 text-[15px] font-semibold transition-colors",
        opts.accent
          ? "text-expedia-yellow"
          : opts.active
            ? "text-white"
            : "text-white/85 hover:text-white",
      ].join(" ")}
    >
      {label}
      {(opts.active || opts.accent) && (
        <span
          className={[
            "absolute -bottom-[19px] left-0 right-0 h-[3px] rounded-t-full",
            opts.accent ? "bg-expedia-yellow" : "bg-white",
          ].join(" ")}
        />
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-expedia-navy">
      <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-8">
        <div className="flex items-center gap-9">
          <button
            onClick={() => onNavigate("search")}
            className="flex items-baseline gap-0.5 font-display text-[22px] font-extrabold tracking-tight text-white"
          >
            <span>expedia</span>
            <span className="text-expedia-yellow">.</span>
          </button>
          <nav className="flex items-center gap-7">
            {item("Stays", { active: screen === "search" })}
            {item("Flights")}
            {item("Cars")}
            {item("Group Trips", {
              accent: inGroup,
              onClick: () =>
                onNavigate(screen === "search" ? "dashboard" : screen),
            })}
            {item("Packages")}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-white/85 hover:text-white">
            Sign in
          </button>
          <button
            onClick={() => onNavigate("dashboard")}
            className="rounded-full bg-expedia-yellow px-4 py-2 text-sm font-semibold text-expedia-ink transition-colors hover:bg-expedia-yellow-hover"
          >
            My trips
          </button>
        </div>
      </div>
    </header>
  );
}
