import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

/**
 * GIGConnect SA logo — SA flag map shape in SVG.
 * Used in the login screen and sidebar header.
 */
export function LogoSA({ size = 48, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GIGConnect South Africa"
    >
      {/* ── Outer circle background ── */}
      <circle cx="100" cy="100" r="100" fill="#1e293b" />

      {/* ── South Africa map outline filled with flag colours ── */}
      {/* Simplified flag-map of SA — three bands */}
      <clipPath id="sa-map">
        <path d="
          M 55 40
          C 60 35, 80 30, 110 32
          C 140 34, 165 42, 175 55
          C 185 68, 182 85, 178 95
          C 174 105, 168 112, 165 120
          C 162 128, 160 138, 152 148
          C 144 158, 130 168, 115 172
          C 100 176, 85 172, 74 165
          C 63 158, 55 148, 48 136
          C 41 124, 36 110, 34 96
          C 32 82, 36 68, 42 58
          C 45 52, 50 44, 55 40
          Z
        "/>
      </clipPath>

      {/* Red band — top */}
      <rect x="30" y="30" width="145" height="52" fill="#E8261A" clipPath="url(#sa-map)"/>
      {/* White thin stripe */}
      <rect x="30" y="82" width="145" height="8"  fill="white"   clipPath="url(#sa-map)"/>
      {/* Green center band */}
      <rect x="30" y="90" width="145" height="28" fill="#007A4D" clipPath="url(#sa-map)"/>
      {/* White thin stripe bottom of green */}
      <rect x="30" y="118" width="145" height="8" fill="white"   clipPath="url(#sa-map)"/>
      {/* Blue band — bottom */}
      <rect x="30" y="126" width="145" height="52" fill="#002395" clipPath="url(#sa-map)"/>

      {/* Y-shape / plow in black and gold — left side of flag */}
      <polygon
        points="30,60  75,100  30,140  50,140  95,104  95,96  50,60"
        fill="#FFB612"
        clipPath="url(#sa-map)"
      />
      <polygon
        points="30,70  65,100  30,130  38,130  70,100  38,70"
        fill="#000000"
        clipPath="url(#sa-map)"
      />

      {/* ── Map border stroke ── */}
      <path
        d="
          M 55 40
          C 60 35, 80 30, 110 32
          C 140 34, 165 42, 175 55
          C 185 68, 182 85, 178 95
          C 174 105, 168 112, 165 120
          C 162 128, 160 138, 152 148
          C 144 158, 130 168, 115 172
          C 100 176, 85 172, 74 165
          C 63 158, 55 148, 48 136
          C 41 124, 36 110, 34 96
          C 32 82, 36 68, 42 58
          C 45 52, 50 44, 55 40
          Z
        "
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        opacity="0.4"
      />

      {/* ── GIG text ── */}
      <text
        x="100"
        y="107"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="28"
        fontWeight="800"
        fill="white"
        textAnchor="middle"
        letterSpacing="2"
      >
        GIG
      </text>
    </svg>
  );
}

/**
 * Compact hexagon icon version — used in sidebar when collapsed.
 */
export function LogoHex({ size = 36, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f14519"/>
          <stop offset="100%" stopColor="#c4340e"/>
        </linearGradient>
      </defs>
      {/* Hexagon */}
      <path
        d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z"
        fill="url(#hex-grad)"
        stroke="none"
      />
      {/* G letter */}
      <text
        x="20" y="25"
        fontFamily="Inter, sans-serif"
        fontSize="16"
        fontWeight="800"
        fill="white"
        textAnchor="middle"
      >G</text>
    </svg>
  );
}

export default LogoSA;
