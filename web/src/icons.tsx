/** Consistent 24×24 stroke icons for scanning / readability (currentColor). */

import type { ReactNode } from "react";

type IconProps = { className?: string; size?: number };

function I({ className, size = 22, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconBrand({ className, size = 22 }: IconProps) {
  return (
    <I className={className} size={size}>
      <circle cx="12" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 20c1.2-3 3.5-4.5 5-4.5s3.8 1.5 5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </I>
  );
}

export function IconCamera({ className, size = 40 }: IconProps) {
  return (
    <I className={className} size={size}>
      <path
        d="M4 8.5a2 2 0 012-2h2.2L9.5 5h5l1.3 1.5H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </I>
  );
}

export function IconCheck({ className, size = 20 }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M6 13l3.5 3.5L18 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}

export function IconInfo({ className, size = 20 }: IconProps) {
  return (
    <I className={className} size={size}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.65" />
      <path d="M12 10.5V16M12 8v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </I>
  );
}

export function IconChevronDown({ className, size = 18 }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}

export function IconSession({ className, size = 18 }: IconProps) {
  return (
    <I className={className} size={size}>
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path d="M4 9h16M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </I>
  );
}

export function IconGeometry({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <ellipse cx="12" cy="11" rx="6" ry="7" stroke="currentColor" strokeWidth="1.65" />
      <path d="M9 8.5h6M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </I>
  );
}

export function IconSkin({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path
        d="M6.5 14c1.5-4 4-6 5.5-6s4 2 5.5 6"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <path d="M8 17.5h8" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" opacity="0.45" />
      <circle cx="15" cy="10" r="1" fill="currentColor" opacity="0.45" />
    </I>
  );
}

export function IconBlemish({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 16h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
    </I>
  );
}

export function IconEye({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path
        d="M4 12s3.5-4.5 8-4.5 8 4.5 8 4.5-3.5 4.5-8 4.5S4 12 4 12z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </I>
  );
}

export function IconVolume({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M8 8c2 1 2 7 0 8M11 6c3 1.5 3 10.5 0 12M14 5c4 2 4 12 0 14" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </I>
  );
}

export function IconFirmness({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M6 18V6l6 3 6-3v12" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
      <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}

export function IconGlow({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.65" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </I>
  );
}

export function IconWrinkles({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M6 9h12M5 13h4M15 13h4M7 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </I>
  );
}

export function IconEyebrow({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M6 12c2.5-2 9.5-2 12 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 14h8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" opacity="0.5" />
    </I>
  );
}

export function IconLip({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path
        d="M7 12c2-1.5 8-1.5 10 0-2 2.5-8 2.5-10 0z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </I>
  );
}

export function IconTeeth({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M7 10h10v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
      <path d="M9 10v7M12 10v7M15 10v7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </I>
  );
}

export function IconJaw({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M6 10c2 5 4 7 6 7s4-2 6-7" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path d="M8 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </I>
  );
}

export function IconExpression({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" />
      <path d="M8 15c1.5 1.5 6.5 1.5 8 0" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </I>
  );
}

export function IconScan({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path d="M9 9h6M9 12h4M9 15h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </I>
  );
}

export function IconGuidance({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M6 12h10M14 8l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}

/** Habits, tools & topical “playbook” section */
export function IconPlaybook({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M7 8h10M7 12h7M7 16h9" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path
        d="M17.5 5.5l.9 1.8 1.8.9-1.8.9-.9 1.8-.9-1.8-1.8-.9 1.8-.9z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </I>
  );
}

export function IconTracking({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <path d="M7 7v10M7 17h10" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path d="M10 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </I>
  );
}

export function IconTechnical({ className, size }: IconProps) {
  return (
    <I className={className} size={size}>
      <rect x="5" y="7" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.65" />
      <path d="M9 11h6M9 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </I>
  );
}

const SECTION_ICON_SIZE = 22;

export function sectionIcon(key: string): ReactNode {
  const size = SECTION_ICON_SIZE;
  switch (key) {
    case "overall_face_shape_geometry":
      return <IconGeometry size={size} />;
    case "skin_type":
      return <IconSkin size={size} />;
    case "blemishes_imperfections":
      return <IconBlemish size={size} />;
    case "dark_circles_under_eye":
      return <IconEye size={size} />;
    case "fat_density_volume":
      return <IconVolume size={size} />;
    case "collagen_elasticity_signals":
      return <IconFirmness size={size} />;
    case "skin_appearance":
      return <IconGlow size={size} />;
    case "lines_wrinkles":
      return <IconWrinkles size={size} />;
    case "eyebrows":
      return <IconEyebrow size={size} />;
    case "lips":
      return <IconLip size={size} />;
    case "teeth_smile":
      return <IconTeeth size={size} />;
    case "cheeks_jaw_lines":
      return <IconJaw size={size} />;
    case "expressions":
      return <IconExpression size={size} />;
    case "scan_process":
      return <IconScan size={size} />;
    case "improvement_playbook":
      return <IconPlaybook size={size} />;
    case "guidance_projection":
      return <IconGuidance size={size} />;
    case "tracking_goals":
      return <IconTracking size={size} />;
    case "source_image":
      return <IconTechnical size={size} />;
    default:
      return <IconScan size={size} />;
  }
}
