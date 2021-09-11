import * as React from "react";

export default function Logo() {
  const style = {
    fill: "var(--background)",
    stroke: "var(--foreground)",
    strokeMiterLimit: 10,
    strokeWidth: "13px",
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">
      <defs></defs>
      <rect
        style={style}
        x="274.84"
        y="291.68"
        width="494.68"
        height="494.68"
        rx="82.35"
        transform="rotate(-21 522.198 539.01)"
      />
      <rect
        style={style}
        x="299.84"
        y="304.68"
        width="494.68"
        height="494.68"
        rx="82.35"
        transform="rotate(-14 547.172 552.01)"
      />
      <rect
        style={style}
        x="323.84"
        y="320.68"
        width="494.68"
        height="494.68"
        rx="82.35"
        transform="rotate(-7 571.152 568.045)"
      />
      <rect
        style={style}
        x="344.82"
        y="339.66"
        width="494.68"
        height="494.68"
        rx="82.35"
      />
      <path
        style={style}
        d="M550.26 545.09h83.81v83.81h-83.81zM550.26 509.88v35.21H515a35.22 35.22 0 1 1 35.22-35.21ZM550.26 664.12v-35.21H515a35.22 35.22 0 1 0 35.22 35.21ZM634.07 509.88v35.21h35.21a35.22 35.22 0 1 0-35.21-35.21ZM634.07 664.12v-35.21h35.21a35.22 35.22 0 1 1-35.21 35.21Z"
      />
    </svg>
  );
}
