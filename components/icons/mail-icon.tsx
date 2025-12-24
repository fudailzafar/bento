export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        width="26"
        height="26"
        className="text-white"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <mask id="path-1-inside-1_5434_16670" fill="currentColor">
          <rect y="3" width="26" height="20" rx="2"></rect>
        </mask>
        <rect
          y="3"
          width="26"
          height="20"
          rx="2"
          stroke="white"
          strokeWidth="6"
          mask="url(#path-1-inside-1_5434_16670)"
        ></rect>
        <path
          d="M2 6L12.3668 14.4819C12.7351 14.7833 13.2649 14.7833 13.6332 14.4819L24 6"
          stroke="white"
          strokeWidth="3"
        ></path>
      </svg>
    </>
  );
};
