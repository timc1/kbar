import * as React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const defaultStyle: React.CSSProperties = {
  position: "fixed",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  inset: "0px",
  padding: "14vh 16px 16px",
};

export default function KBarPositioner(props: Props) {
  return (
    <div style={!props.className ? defaultStyle : undefined} {...props}>
      {props.children}
    </div>
  );
}
