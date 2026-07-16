export const IconeCalendarioCronograma = () => {
  const color = "#A4A4A4";

  return (
    <svg
      className="fill-white"
      width="120"
      height="108"
      viewBox="0 0 120 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Calendário de cronogramas"
    >
      <mask
        id="calendar-schedule-mask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="120"
        height="108"
      >
        <rect width="120" height="108" fill="#FFFFFF" />
        <circle cx="95" cy="73" r="25" fill="#000000" />
      </mask>

      <g mask="url(#calendar-schedule-mask)">
        <path
          d="M24 18 H79 C82.866 18 86 21.134 86 25 V72 C86 75.866 82.866 79 79 79 H24 C20.134 79 17 75.866 17 72 V25 C17 21.134 20.134 18 24 18 Z"
          stroke={color}
          strokeWidth="4"
          style={{ fill: "none" }}
        />

        <path d="M29 8H35V19H29V8Z" fill={color} />
        <path d="M69 8H75V19H69V8Z" fill={color} />

        <path d="M29 31H36V38H29V31Z" fill={color} />
        <path d="M48 31H55V38H48V31Z" fill={color} />
        <path d="M67 31H74V38H67V31Z" fill={color} />

        <path d="M29 46H36V53H29V46Z" fill={color} />
        <path d="M48 46H55V53H48V46Z" fill={color} />
        <path d="M67 46H74V53H67V46Z" fill={color} />

        <path d="M29 61H36V68H29V61Z" fill={color} />
        <path d="M48 61H55V68H48V61Z" fill={color} />
      </g>

      <g transform="translate(4 -8)">
        <path
          d="M114 81 A23 23 0 1 1 68 81 A23 23 0 1 1 114 81 Z"
          stroke={color}
          strokeWidth="4"
          style={{ fill: "none" }}
        />

        <path
          d="M91 67L102 73.5L91 80L80 73.5L91 67Z"
          stroke={color}
          strokeWidth="3.2"
          strokeLinejoin="round"
          style={{ fill: "none" }}
        />

        <path
          d="M80 73.5V86.5L91 93L102 86.5V73.5"
          stroke={color}
          strokeWidth="3.2"
          strokeLinejoin="round"
          style={{ fill: "none" }}
        />

        <path
          d="M91 80V93"
          stroke={color}
          strokeWidth="3.2"
          strokeLinejoin="round"
          style={{ fill: "none" }}
        />

        <path
          d="M85.5 70.25L96.5 76.75"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          style={{ fill: "none" }}
        />

        <path
          d="M96.5 76.75V82.5"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          style={{ fill: "none" }}
        />
      </g>
    </svg>
  );
};

export default IconeCalendarioCronograma;
