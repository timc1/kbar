import * as React from "react";
import useScrollbarSize from 'react-scrollbar-size';

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
  const scrollbar = useScrollbarSize();
  
  return (
    <div style={{...defaultStyle, width: `calc(100% - ${scrollbar.width})px`}} {...props}>
      {props.children}
    </div>
  );
}
