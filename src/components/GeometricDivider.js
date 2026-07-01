export default function GeometricDivider({ className = "" }) {
  return (
    <svg
      className={className}
      width="100%"
      height="10"
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="starTile" width="20" height="10" patternUnits="userSpaceOnUse">
          <path
            d="M10 0 L12.5 3.5 L17 3 L14.5 6.5 L17 10 L12.5 8.5 L10 12 L7.5 8.5 L3 10 L5.5 6.5 L3 3 L7.5 3.5 Z"
            fill="none"
            stroke="#C9A24B"
            strokeWidth="0.6"
            opacity="0.55"
          />
        </pattern>
      </defs>
      <rect width="200" height="10" fill="url(#starTile)" />
    </svg>
  );
}
