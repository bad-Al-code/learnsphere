import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      {/* Background SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mask-80 animate-show pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center"
      >
        <defs>
          <linearGradient>
            <stop offset="5%" stopColor="#fff"></stop>
            <stop offset="95%" stopColor="#00f"></stop>
          </linearGradient>
          <linearGradient x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="red"></stop>
            <stop offset="95%" stopColor="orange"></stop>
          </linearGradient>
          <filter id="orange-glow" width="200%" height="200%" x="-50%" y="-50%">
            <feGaussianBlur
              in="SourceAlpha"
              result="blur"
              stdDeviation="3"
            ></feGaussianBlur>
            <feOffset in="blur" result="offsetBlur"></feOffset>
            <feFlood
              floodColor="orange"
              floodOpacity="1"
              result="offsetColor"
            ></feFlood>
            <feComposite
              in="offsetColor"
              in2="offsetBlur"
              operator="in"
              result="offsetBlur"
            ></feComposite>
            <feMerge>
              <feMergeNode in="offsetBlur"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
          <pattern
            id="Pattern"
            width="48"
            height="48"
            x="0"
            y="0"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="32"
              height="32"
              x="8"
              y="8"
              fill="none"
              filter="url(#orange-glow)"
              rx="6"
              ry="6"
              stroke="orange"
              strokeOpacity="0.175"
            ></rect>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#Pattern)"></rect>
      </svg>

      {children}
    </div>
  );
}
