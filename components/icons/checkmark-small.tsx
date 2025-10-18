export const CheckmarkSmall = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 154 154"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      className={className}
    >
      <g fill="none" stroke="#4EDD76" strokeWidth="2">
        <circle
          id="colored"
          fill="#4EDD76"
          cx="77"
          cy="77"
          r="72"
          style={{
            strokeDasharray: '480px, 480px',
            strokeDashoffset: '960px',
          }}
        ></circle>
        <polyline
          className="st0"
          stroke="#fff"
          strokeWidth="10"
          points="43.5,77.8 63.7,97.9 112.2,49.4"
          style={{
            strokeDasharray: '100px, 100px',
            strokeDashoffset: '200px',
            animationDelay: '0s',
          }}
        ></polyline>
      </g>
    </svg>
  );
};

export const CheckmarkLarge = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 154 154"
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      className={className}
    >
      <g fill="none" stroke="#4edd76" strokeWidth="2">
        <circle
          id="colored"
          fill="#4edd76"
          cx="77"
          cy="77"
          r="72"
          style={{
            strokeDasharray: '480px, 480px',
            strokeDashoffset: '960px',
          }}
        ></circle>
        <polyline
          className="st0"
          stroke="#fff"
          strokeWidth="10"
          points="43.5,77.8 63.7,97.9 112.2,49.4"
          style={{
            strokeDasharray: '100px, 100px',
            strokeDashoffset: '200px',
          }}
        ></polyline>
      </g>
    </svg>
  );
};
