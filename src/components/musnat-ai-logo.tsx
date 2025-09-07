import { type SVGProps } from 'react';

export function MusnatAiLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      <path
        d="M50 2.5C23.77 2.5 2.5 23.77 2.5 50S23.77 97.5 50 97.5 97.5 76.23 97.5 50 76.23 2.5 50 2.5ZM50 87.5C29.29 87.5 12.5 70.71 12.5 50S29.29 12.5 50 12.5 87.5 29.29 87.5 50 70.71 87.5 50 87.5Z"
        fill="currentColor"
      />
      <path
        d="M62.5 37.5H37.5V50H62.5V37.5Z"
        fill="currentColor"
        className="text-primary"
      />
      <path
        d="M50 62.5C43.09 62.5 37.5 56.91 37.5 50H25C25 63.81 36.19 75 50 75S75 63.81 75 50H62.5C62.5 56.91 56.91 62.5 50 62.5Z"
        fill="currentColor"
      />
      <circle cx="35" cy="30" r="3" fill="currentColor" />
      <circle cx="65" cy="30" r="3" fill="currentColor" />
    </svg>
  );
}
