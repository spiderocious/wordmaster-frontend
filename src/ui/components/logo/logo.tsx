export interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 48, height = 48, className = '' }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1371ec" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Background circle with subtle glow */}
      <circle cx="24" cy="24" r="22" fill="url(#letterGradient)" opacity="0.1" />
      
      {/* Main 'A' letter - bold and modern */}
      <path
        d="M24 8L36 38H31L28.5 31H19.5L17 38H12L24 8ZM24 17L21 26H27L24 17Z"
        fill="url(#letterGradient)"
        strokeWidth="0.5"
        stroke="#1371ec"
      />
      
      {/* Sparkle/Star top right - represents winning/achievement */}
      <path
        d="M37 13L38 16L41 17L38 18L37 21L36 18L33 17L36 16L37 13Z"
        fill="url(#sparkGradient)"
      />
      
      {/* Small sparkle bottom left */}
      <circle cx="11" cy="35" r="1.5" fill="#f59e0b" opacity="0.8" />
      <circle cx="14" cy="33" r="1" fill="#ef4444" opacity="0.6" />
      
      {/* Curved underline accent - suggests speed/game */}
      <path
        d="M15 40Q24 42 33 40"
        stroke="url(#sparkGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}