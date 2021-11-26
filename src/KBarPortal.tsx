import Portal from "@reach/portal";
import * as React from "react";
import { VisualState } from "./types";
import { useKBar } from "./useKBar";

interface Props {
  children: React.ReactNode;
}

export function KBarPortal(props: Props) {
  const { showing } = useKBar((state) => ({
    showing: state.visualState !== VisualState.hidden,
  }));

  if (!showing) {
    return null;
  }

  return <Portal>{props.children}</Portal>;
}
