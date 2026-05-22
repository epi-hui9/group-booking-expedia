import { useEffect } from "react";
import { ArrowRightIcon, CheckCircleIcon, XIcon } from "./Icon";

export function Toast({
  title,
  onClose,
  onAction,
  actionLabel = "View group trip",
}: {
  title: string;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-slideUp">
      <div className="flex w-[440px] items-center gap-3 rounded-2xl border border-expedia-line bg-white p-4 shadow-cardHover">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-expedia-success-soft text-expedia-success">
          <CheckCircleIcon size={20} />
        </span>
        <div className="min-w-0 flex-1 text-sm font-semibold text-expedia-ink">
          {title}
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-expedia-blue px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-expedia-blue-hover"
          >
            {actionLabel}
            <ArrowRightIcon size={13} />
          </button>
        )}
        <button
          onClick={onClose}
          className="shrink-0 rounded-full p-1.5 text-expedia-mute transition-colors hover:bg-expedia-line/60 hover:text-expedia-ink"
        >
          <XIcon size={14} />
        </button>
      </div>
    </div>
  );
}
