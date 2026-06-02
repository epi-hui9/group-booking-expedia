import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const StarIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...base(size)} {...props} fill="currentColor" stroke="none">
    <path d="M12 2.6l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.77 6.16 20.57l1.11-6.5L2.55 9.47l6.53-.95L12 2.6z" />
  </svg>
);

export const SearchIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const HeartIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M12 21s-7-4.35-9.33-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.33 12C19 16.65 12 21 12 21z" />
  </svg>
);

export const PlusIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CheckIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M5 12l4.5 4.5L19 7" />
  </svg>
);

export const CheckCircleIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5L15.5 9.5" />
  </svg>
);

export const ThumbsUpIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M7 10v10H4V10h3z" />
    <path d="M7 10l4.5-7c1.4-.3 2.5.8 2.5 2v4h5.2c1.2 0 2 1.1 1.7 2.2l-1.8 6.6c-.3 1-1.2 1.6-2.2 1.6H7" />
  </svg>
);

export const QuestionIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 015 .2c0 1.4-1.7 1.8-2.3 2.6-.4.5-.4 1.2-.2 1.7" />
    <path d="M12 17h.01" />
  </svg>
);

export const ChevronLeftIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const CalendarIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

export const UsersIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <circle cx="9" cy="9" r="3.5" />
    <path d="M2.5 19a6.5 6.5 0 0113 0" />
    <circle cx="17" cy="10" r="2.5" />
    <path d="M15 19a4 4 0 016-3.4" />
  </svg>
);

export const MapPinIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const SparkleIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
    <path d="M19 16l.8 2 2 .8-2 .8L19 22l-.8-2-2-.8 2-.8L19 16z" />
  </svg>
);

export const TrophyIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M8 4h8v4a4 4 0 11-8 0V4z" />
    <path d="M8 4H4v2a3 3 0 003 3M16 4h4v2a3 3 0 01-3 3" />
    <path d="M10 13h4v3h-4zM8 19h8" />
  </svg>
);

export const XIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowRightIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ShieldIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const BedIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M3 18V8M21 18v-6a3 3 0 00-3-3H9v6M3 14h18" />
  </svg>
);

export const ClockIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const BellIcon = ({ size = 14, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M6 9a6 6 0 0112 0v4l1.5 2.5h-15L6 13V9z" />
    <path d="M10 19a2 2 0 004 0" />
  </svg>
);

export const PlaneIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M10.5 3.2c.4-.9 1.6-.9 2 0L13 8l7 4.2c.5.3.5 1.1-.1 1.3L13 16l-.5 4.3c-.1.6-.6.9-1 .6L10 19l-3 .8c-.5.1-.9-.3-.7-.8L7.5 16 4 14.4c-.6-.3-.5-1.1.1-1.3L11 11l-.5-7.8z" />
  </svg>
);

export const DotsIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const TrashIcon = ({ size = 16, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M4 7h16M9 7V5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 5v2M6 7l1 12.5A1.5 1.5 0 008.5 21h7a1.5 1.5 0 001.5-1.5L18 7" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

export const SuitcaseIcon = ({ size = 36, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <rect x="3.5" y="7" width="17" height="13" rx="2.5" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
    <path d="M3.5 12h17" />
  </svg>
);
