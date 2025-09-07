import { type SVGProps } from 'react';

export function MusnatAiLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
      <g className="animate-head-bob">
        <rect
          x="25"
          y="45"
          width="50"
          height="35"
          rx="5"
          fill="currentColor"
        />
        <circle cx="40" cy="63" r="4" fill="black" />
        <circle cx="60" cy="63" r="4" fill="black" />
        <line
          x1="45"
          y1="72"
          x2="55"
          y2="72"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <line
        x1="50"
        y1="45"
        x2="50"
        y2="30"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        className="animate-antenna-blink"
        cx="50"
        cy="25"
        r="5"
        fill="currentColor"
      />
    </svg>
  );
}
