export const SectionIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="4" y="12" width="7" height="8" rx="3" fill="#E3E3E3"></rect>
      <rect
        x="4.5"
        y="12.5"
        width="6"
        height="7"
        rx="2.5"
        stroke="black"
        stroke-opacity="0.08"
      ></rect>
      <rect x="13" y="12" width="7" height="8" rx="3" fill="#E3E3E3"></rect>
      <rect
        x="13.5"
        y="12.5"
        width="6"
        height="7"
        rx="2.5"
        stroke="black"
        stroke-opacity="0.08"
      ></rect>
      <rect
        x="4"
        y="4"
        width="12"
        height="5"
        rx="2.5"
        fill="url(#paint0_linear_7289_21481)"
      ></rect>
      <defs>
        <linearGradient
          id="paint0_linear_7289_21481"
          x1="10"
          y1="4"
          x2="10"
          y2="9"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#5B5B5B"></stop>
          <stop offset="1"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
