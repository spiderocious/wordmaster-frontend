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
      {/* Simple, bold 'A' lettermark */}
      <path
        d="M24 6L38 42H32L29 34H19L16 42H10L24 6ZM24 16L20.5 26H27.5L24 16Z"
        fill="#1371ec"
      />
    </svg>
  );
}
