/** The extension mark: code brackets around a lightbulb. */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="CS Concept Companion logo"
    >
      <path
        d="M7 5 3.5 12 7 19"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 5l3.5 7L17 19"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.2" r="3.4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 13.6v2.6M10.7 18.4h2.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
