'use client';

import { motion } from 'framer-motion';

const DotGridBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
      <svg className="absolute inset-0 h-full w-full opacity-30">
        <defs>
          <pattern
            id="dot-pattern"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1"
              fill="hsl(var(--foreground))"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>
    </div>
  );
};

// 2. Grid Lines Pattern (Most Popular)
const GridBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.1),transparent_50%)]" />
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern
            id="grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Gradient Orbs */}
      <div className="bg-primary/5 absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
      <div
        className="bg-primary/3 absolute bottom-0 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
};

// 3. Mesh Gradient Background
const MeshGradientBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="from-background via-background to-muted/50 absolute inset-0 bg-gradient-to-br" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 h-full w-full"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="bg-primary/10 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute top-3/4 left-3/4 h-96 w-96 rounded-full blur-3xl" />
      </motion.div>

      {/* Grid overlay */}
      <svg className="absolute inset-0 h-full w-full opacity-20">
        <defs>
          <pattern
            id="mesh-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh-grid)" />
      </svg>
    </div>
  );
};

// 4. Hexagon Pattern
const HexagonBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <svg className="absolute inset-0 h-full w-full opacity-20">
        <defs>
          <pattern
            id="hexagons"
            width="50"
            height="43.4"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(2)"
          >
            <polygon
              points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
      <div className="from-background/50 to-background/50 absolute inset-0 bg-gradient-to-b via-transparent" />
    </div>
  );
};

// 5. Circuit Board Pattern
const CircuitBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <svg className="absolute inset-0 h-full w-full opacity-10">
        <defs>
          <pattern
            id="circuit"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="25" cy="25" r="2" fill="hsl(var(--primary))" />
            <circle cx="75" cy="75" r="2" fill="hsl(var(--primary))" />
            <circle cx="75" cy="25" r="2" fill="hsl(var(--primary))" />
            <circle cx="25" cy="75" r="2" fill="hsl(var(--primary))" />
            <line
              x1="25"
              y1="25"
              x2="75"
              y2="25"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
            <line
              x1="25"
              y1="75"
              x2="75"
              y2="75"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
            <line
              x1="25"
              y1="25"
              x2="25"
              y2="75"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
            <line
              x1="75"
              y1="25"
              x2="75"
              y2="75"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
      <div className="from-background to-muted/30 absolute inset-0 bg-gradient-to-br via-transparent" />
    </div>
  );
};

// 6. Wavy Lines Pattern
const WavyLinesBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <svg className="absolute inset-0 h-full w-full opacity-30">
        <defs>
          <pattern
            id="waves"
            width="100"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 10 Q 25 0, 50 10 T 100 10"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waves)" />
      </svg>
      <div className="from-background/80 to-background/80 absolute inset-0 bg-gradient-to-b via-transparent" />
    </div>
  );
};

export {
  CircuitBackground,
  DotGridBackground,
  GridBackground,
  HexagonBackground,
  MeshGradientBackground,
  WavyLinesBackground,
};
