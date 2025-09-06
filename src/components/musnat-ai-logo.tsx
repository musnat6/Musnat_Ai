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
      <path d="M14 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
      <path d="M12 12h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2" />
      <path d="M4 12h2a2 2 0 0 0 2-2V8a2 2 0 0 1 2-2" />
      <path d="M18 22h-2a2 2 0 0 1-2-2v-2a2 2 0 0 0-2-2" />
      <path d="M6 14v2a2 2 0 0 0 2 2h2" />
    </svg>
  );
}
