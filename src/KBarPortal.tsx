import { Portal } from "@radix-ui/react-portal";
import * as React from "react";
import { VisualState } from "./types";
import { useKBar } from "./useKBar";

interface Props {
  children: React.ReactNode;
  host?: HTMLElement;
}

export function KBarPortal(props: Props) {
  const { showing } = useKBar((state) => ({
    showing: state.visualState !== VisualState.hidden,
  }));

  if (!showing) {
    return null;
  }

  return <Portal container={props.host}>{props.children}</Portal>;
}
