import React from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number; // The width and height of the SVG
  radius?: number; // The radius of the circle
  strokeWidth?: number;
  className?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 112,
  radius = 46,
  strokeWidth = 8,
  className = ''
}) => {
  const circumference = 2 * Math.PI * radius;
  // Clamp progress to be between 0 and 100.
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`transform -rotate-90 ${className}`}
    >
      {/* Background circle */}
      <circle
        className="text-gray-700"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
      />
      {/* Foreground progress circle - conditionally rendered to avoid 0% artifact */}
      {clampedProgress > 0 && (
          <circle
            className="text-primary-500"
            style={{ transition: 'stroke-dashoffset 0.35s ease-out' }}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
          />
      )}
    </svg>
  );
};

export default ProgressRing;
