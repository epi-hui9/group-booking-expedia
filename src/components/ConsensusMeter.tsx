export function ConsensusMeter({
  yes,
  not,
  none,
  total,
  size = "md",
}: {
  yes: number;
  not: number;
  none: number;
  total: number;
  size?: "sm" | "md" | "lg";
}) {
  const yesPct = (yes / total) * 100;
  const notPct = (not / total) * 100;
  const nonePct = (none / total) * 100;
  const h = size === "lg" ? "h-2.5" : size === "sm" ? "h-1.5" : "h-2";
  return (
    <div
      className={`flex w-full overflow-hidden rounded-full bg-expedia-line-soft ${h}`}
    >
      <div
        className="bg-expedia-success transition-[width] duration-500"
        style={{ width: `${yesPct}%` }}
      />
      <div
        className="bg-expedia-warn/80 transition-[width] duration-500"
        style={{ width: `${notPct}%` }}
      />
      <div
        className="bg-expedia-line transition-[width] duration-500"
        style={{ width: `${nonePct}%` }}
      />
    </div>
  );
}
