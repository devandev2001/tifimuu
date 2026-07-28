/**
 * Static cartoon illustration of the three-tier tiffin carrier.
 * Shown while the 3D scene loads, for reduced-motion visitors, and as
 * the fallback when WebGL is unavailable or the scene fails.
 */
export function TiffinPoster() {
  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label="Illustration of a green three-tier tiffin carrier"
      className="h-full w-full"
    >
      {/* ground shadow */}
      <ellipse cx="160" cy="292" rx="92" ry="13" fill="#283724" opacity="0.16" />

      {/* side rails */}
      <rect x="68" y="58" width="9" height="218" rx="4.5" fill="#c2c9cf" />
      <rect x="243" y="58" width="9" height="218" rx="4.5" fill="#c2c9cf" />

      {/* handle arch and grip */}
      <path
        d="M72 62 Q160 -12 248 62"
        fill="none"
        stroke="#c2c9cf"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect x="132" y="16" width="56" height="19" rx="9.5" fill="#283724" />

      {/* bottom tier */}
      <rect x="84" y="212" width="152" height="62" rx="12" fill="#b7d36c" />
      <rect x="79" y="201" width="162" height="15" rx="7.5" fill="#dde3e8" />

      {/* middle tier */}
      <rect x="84" y="146" width="152" height="58" rx="12" fill="#b7d36c" />
      <rect x="79" y="135" width="162" height="15" rx="7.5" fill="#dde3e8" />

      {/* top tier */}
      <rect x="84" y="84" width="152" height="55" rx="12" fill="#b7d36c" />

      {/* lid */}
      <path d="M84 84 Q160 34 236 84 Z" fill="#c0d167" />
      <rect x="80" y="76" width="160" height="13" rx="6.5" fill="#dde3e8" />

      {/* brand badge */}
      <circle cx="160" cy="176" r="18" fill="#283724" />
      <text
        x="160"
        y="184"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fontFamily="var(--font-baloo), sans-serif"
        fill="#ccea94"
      >
        t
      </text>
    </svg>
  );
}
