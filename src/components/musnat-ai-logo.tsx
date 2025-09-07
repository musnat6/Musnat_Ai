import { type SVGProps } from 'react';

export function MusnatAiLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
      <path d="M8 12h8" />
      <path d="M8 16h4" />
      <path d="M16 16h0" />
      <circle cx="8" cy="8" r="1" />
      <circle cx="16" cy="8" r="1" />
    </svg>
  );
}
