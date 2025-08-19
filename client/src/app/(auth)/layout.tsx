import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="animate-show mask-radial-from-muted-foreground pointer-events-none absolute inset-0 -z-10 h-full w-full text-gray-500"
      >
        <defs>
          <filter id="gray-glow" width="200%" height="200%" x="-50%" y="-50%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feFlood
              floodColor="rgb(107 114 128)"
              floodOpacity="0.6"
              result="flood"
            />
            <feComposite
              in="flood"
              in2="blur"
              operator="in"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <g id="cryingCat">
            <ellipse
              cx="20"
              cy="25"
              rx="14"
              ry="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M8 20 L12 12 L16 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M24 20 L28 12 L32 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M13 22 Q15 20, 17 22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M23 22 Q25 20, 27 22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M16 30 Q20 32, 24 30"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
          </g>
          <g id="shockedCat">
            <ellipse
              cx="20"
              cy="25"
              rx="13"
              ry="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M9 20 L12 12 L15 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M25 20 L28 12 L31 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <circle
              cx="15"
              cy="23"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.9"
            />
            <circle
              cx="25"
              cy="23"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.9"
            />
            <ellipse
              cx="20"
              cy="30"
              rx="3"
              ry="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.9"
            />
          </g>
          <g id="coolCat">
            <ellipse
              cx="20"
              cy="25"
              rx="14"
              ry="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M8 20 L12 12 L16 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M24 20 L28 12 L32 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <rect
              x="10"
              y="20"
              width="20"
              height="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
              rx="4"
            />
            <path
              d="M19 24 L21 24"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M17 28 Q20 30, 23 28"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity="0.9"
            />
          </g>
          <g id="happyCat">
            <ellipse
              cx="20"
              cy="25"
              rx="14"
              ry="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M8 20 L12 12 L16 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M24 20 L28 12 L32 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M14 22 Q16 20, 18 22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M22 22 Q24 20, 26 22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M15 28 Q20 32, 25 28"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
          </g>
          <g id="grumpyCat">
            <ellipse
              cx="20"
              cy="25"
              rx="15"
              ry="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M8 20 L12 12 L16 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M24 20 L28 12 L32 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M13 22 L17 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M27 22 L23 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M16 30 Q20 28, 24 30"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
          </g>
          <g id="politeCat">
            <ellipse
              cx="20"
              cy="28"
              rx="16"
              ry="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
              transform="rotate(-5 20 28)"
            />
            <path
              d="M6 22 L10 14 L14 22 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M26 22 L30 14 L34 22 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <circle
              cx="15"
              cy="26"
              r="2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.9"
            />
            <circle
              cx="26"
              cy="26"
              r="2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.9"
            />
            <path
              d="M19 32 Q21 33, 23 32"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
          </g>
          <g id="coughingCat">
            <ellipse
              cx="20"
              cy="25"
              rx="13"
              ry="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M9 20 L12 12 L15 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M25 20 L28 12 L31 20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M12 24 L16 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M28 24 L24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
            <ellipse
              cx="20"
              cy="30"
              rx="3"
              ry="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.9"
            />
          </g>

          <pattern
            id="catStickersPattern"
            width="280"
            height="280"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(.6)"
          >
            <use
              href="#shockedCat"
              x="50"
              y="150"
              transform="rotate(20 50 150)"
            />
            <use
              href="#cryingCat"
              x="220"
              y="130"
              transform="rotate(10 220 130)"
            />
            <use
              href="#politeCat"
              x="140"
              y="230"
              transform="rotate(-15 140 230)"
            />
            <use
              href="#coughingCat"
              x="20"
              y="240"
              transform="rotate(25 20 240)"
            />

            <use
              href="#happyCat"
              x="20"
              y="30"
              transform="rotate(-10 20 30)"
              filter="url(#gray-glow)"
            />
            <use
              href="#coolCat"
              x="100"
              y="50"
              transform="rotate(15 100 50)"
              filter="url(#gray-glow)"
            />
            <use
              href="#grumpyCat"
              x="200"
              y="40"
              transform="rotate(-5 200 40)"
              filter="url(#gray-glow)"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#catStickersPattern)" />
      </svg>

      {children}
    </div>
  );
}
