import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

/**
 * GIGConnect SA logo — uses the uploaded South Africa SVG flag map.
 * Used as LogoSA (large, on auth pages) and LogoHex (compact, in sidebar).
 */
export function LogoSA({ size = 48, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 900 700"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GIGConnect South Africa"
    >
      <g transform="translate(140,90)">
        {/* White outline base */}
        <path
          d="M120 210 L180 120 L300 80 L450 95 L560 70 L620 130 L610 250
             L640 340 L560 390 L430 430 L350 480 L220 450 L120 390
             L70 300 Z"
          fill="#ffffff"
          stroke="#222"
          strokeWidth="10"
          strokeLinejoin="round"
        />
        {/* Green */}
        <path
          d="M120 210 L300 80 L450 95 L620 130 L610 250 L640 340 L560 390
             L430 430 L350 480 L220 450 L120 390 L70 300 Z"
          fill="#007a4d"
        />
        {/* Black triangle */}
        <polygon points="70,300 120,210 170,250 120,330" fill="#000000" />
        {/* Gold triangle */}
        <polygon points="120,210 170,250 300,180 260,140" fill="#ffb612" />
        {/* Blue band */}
        <path d="M170 250 L640 340 L560 390 L120 330 Z" fill="#002395" />
        {/* White stripes */}
        <path d="M145 238 L610 145" stroke="#ffffff" strokeWidth="28" />
        <path d="M145 322 L585 365" stroke="#ffffff" strokeWidth="28" />
        {/* Red section */}
        <path
          d="M420 95 L560 70 L620 130 L610 250 L500 235 L430 180 Z"
          fill="#de3831"
        />
      </g>

      {/* "SOUTH AFRICA" text below the map */}
      <text
        x="450"
        y="620"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="48"
        letterSpacing="12"
        fill="#444"
      >
        SOUTH AFRICA
      </text>
    </svg>
  );
}

/**
 * Compact hex icon — used in the sidebar header.
 */
export function LogoHex({ size = 36, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GIGConnect"
    >
      <defs>
        <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f14519" />
          <stop offset="100%" stopColor="#c4340e" />
        </linearGradient>
      </defs>
      {/* Hexagon shape */}
      <path
        d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z"
        fill="url(#hex-grad)"
      />
      {/* G letter */}
      <text
        x="20"
        y="25"
        fontFamily="Inter, sans-serif"
        fontSize="16"
        fontWeight="800"
        fill="white"
        textAnchor="middle"
      >
        G
      </text>
    </svg>
  );
}

export default LogoSA;
