/**
 * MediTrack Pro Logo — SVG component
 * Combines a medical cross with a tracking shield element.
 * Usage: <MediTrackLogo size={40} />  or  <MediTrackLogo size={24} light />
 */
export default function MediTrackLogo({ size = 40, light = false, className = "" }) {
  const primary = light ? "#ffffff" : "#0f4c75";
  const accent = "#14b8a6";
  const crossFill = light ? "#14b8a6" : "#ffffff";
  const s = size;
  const half = s / 2;
  const unit = s / 40; // scale factor from 40px base

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MediTrack Pro logo"
    >
      {/* Shield shape */}
      <path
        d="M20 2 L36 8 L36 20 C36 30 28 36 20 38 C12 36 4 30 4 20 L4 8 Z"
        fill={primary}
        stroke={accent}
        strokeWidth="1.5"
      />
      {/* Inner shield highlight */}
      <path
        d="M20 5 L33 10 L33 20 C33 28 26.5 33.5 20 35.5 C13.5 33.5 7 28 7 20 L7 10 Z"
        fill={primary}
        opacity="0.85"
      />
      {/* Medical cross */}
      <rect x="16" y="11" width="8" height="18" rx="1.5" fill={crossFill} />
      <rect x="11" y="16" width="18" height="8" rx="1.5" fill={crossFill} />
      {/* Tracking dot / pulse indicator */}
      <circle cx="31" cy="10" r="4" fill={accent} />
      <circle cx="31" cy="10" r="2" fill="#ffffff" />
      {/* Subtle connection lines */}
      <line x1="28" y1="12" x2="25" y2="15" stroke={accent} strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
