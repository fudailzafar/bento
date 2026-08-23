// bento's upload ring: a small circle filling up in the tile's corner.
export function UploadRing({ progress = 0 }: { progress?: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg
      className="absolute left-4 top-4 size-6 -rotate-90"
      viewBox="0 0 24 24"
      fill="none"
      role="progressbar"
      aria-label="Uploading"
    >
      <circle
        cx="12"
        cy="12"
        r={r}
        stroke="white"
        strokeOpacity=".5"
        strokeWidth="2.5"
      />
      <circle
        cx="12"
        cy="12"
        r={r}
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.max(progress, 0.08))}
        className="transition-[stroke-dashoffset] duration-200"
      />
    </svg>
  );
}
