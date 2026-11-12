import { initials } from "@/lib/utils";
import { profile } from "@/data/profile";

/**
 * Placeholder avatar: an abstract initials mark rather than a fabricated
 * photo. Swap <AvatarMark /> for a real <Image src="/avatar.jpg" .../>
 * once a profile photo is available — see README.
 */
export function AvatarMark({ size = 220 }: { size?: number }) {
  const id = "avatarGrad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      role="img"
      aria-label={`${profile.name} — placeholder avatar`}
      className="rounded-[28%] shadow-2xl shadow-black/40"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f7dff" />
          <stop offset="55%" stopColor="#2f3b57" />
          <stop offset="100%" stopColor="#0a0e18" />
        </linearGradient>
      </defs>
      <rect width="220" height="220" rx="56" fill={`url(#${id})`} />
      <rect
        width="220"
        height="220"
        rx="56"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.5"
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-display)"
        fontSize="76"
        fontWeight="700"
        fill="white"
        opacity="0.95"
      >
        {initials(profile.name)}
      </text>
    </svg>
  );
}
