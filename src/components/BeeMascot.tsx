interface BeeMascotProps {
  className?: string;
  animated?: boolean;
}

export default function BeeMascot({ className = "", animated = true }: BeeMascotProps) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={`${className} ${animated ? "animate-[float_3.5s_ease-in-out_infinite]" : ""}`}
      role="img"
      aria-label="Abelha mascote"
    >
      <style>
        {`@keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }`}
      </style>

      {/* wings */}
      <ellipse cx="62" cy="80" rx="34" ry="22" fill="#F3ECDD" stroke="#3E2A1E" strokeWidth="3" opacity="0.9" transform="rotate(-18 62 80)" />
      <ellipse cx="138" cy="80" rx="34" ry="22" fill="#F3ECDD" stroke="#3E2A1E" strokeWidth="3" opacity="0.9" transform="rotate(18 138 80)" />

      {/* antennae */}
      <path d="M84 60 C 78 38, 70 28, 66 18" fill="none" stroke="#1B1208" strokeWidth="4" strokeLinecap="round" />
      <circle cx="66" cy="18" r="5" fill="#1B1208" />
      <path d="M116 60 C 122 38, 130 28, 134 18" fill="none" stroke="#1B1208" strokeWidth="4" strokeLinecap="round" />
      <circle cx="134" cy="18" r="5" fill="#1B1208" />

      {/* body */}
      <ellipse cx="100" cy="130" rx="62" ry="70" fill="#F2B33D" stroke="#1B1208" strokeWidth="4" />

      {/* stripes */}
      <path d="M40 105 a62 70 0 0 0 120 0 Z" fill="#1B1208" />
      <rect x="39" y="142" width="122" height="24" fill="#1B1208" />
      <rect x="45" y="186" width="110" height="20" rx="10" fill="#1B1208" />

      {/* face */}
      <circle cx="78" cy="95" r="14" fill="#FFF8EA" stroke="#1B1208" strokeWidth="3" />
      <circle cx="122" cy="95" r="14" fill="#FFF8EA" stroke="#1B1208" strokeWidth="3" />
      <circle cx="80" cy="97" r="5" fill="#1B1208" />
      <circle cx="120" cy="97" r="5" fill="#1B1208" />
      <path d="M92 112 Q100 118 108 112" fill="none" stroke="#1B1208" strokeWidth="3" strokeLinecap="round" />

      {/* legs */}
      <path d="M55 178 L38 196" stroke="#1B1208" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 200 L100 216" stroke="#1B1208" strokeWidth="4" strokeLinecap="round" />
      <path d="M145 178 L162 196" stroke="#1B1208" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
