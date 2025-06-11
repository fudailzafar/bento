export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="1" y="3" width="15" height="2" rx="1" fill="currentColor"></rect>
      <rect y="11" width="15" height="2" rx="1" fill="currentColor"></rect>
      <circle
        cx="10"
        cy="4"
        r="2"
        fill="white"
        stroke="currentColor"
        strokeWidth="2"
      ></circle>
      <circle
        cx="6"
        cy="12"
        r="2"
        fill="white"
        stroke="currentColor"
        strokeWidth="2"
      ></circle>
    </svg>
  );
};

