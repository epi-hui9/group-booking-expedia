import { useState } from "react";
import { BedIcon } from "./Icon";

/**
 * Hotel image that always fills its (sized) parent. If the source fails to
 * load, it renders a calm, Expedia-grade fallback panel with the hotel name
 * instead of the browser's broken-image icon or raw alt text.
 *
 * `imgClassName` adds image-only classes (e.g. hover transforms).
 */
export function HotelImage({
  src,
  alt,
  imgClassName = "",
}: {
  src: string;
  alt: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-expedia-blue-soft via-white to-expedia-line-soft"
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-expedia-blue shadow-card">
            <BedIcon size={20} />
          </span>
          <span className="text-[12.5px] font-semibold leading-tight text-expedia-slate">
            {alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
      className={["h-full w-full object-cover", imgClassName].join(" ")}
    />
  );
}
