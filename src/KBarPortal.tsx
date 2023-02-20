import { Portal } from "@radix-ui/react-portal";
import * as React from "react";
import { VisualState } from "./types";
import { useKBar } from "./useKBar";

interface Props {
  children: React.ReactNode;
  container?: HTMLElement;
}

export function KBarPortal({ children, container }: Props) {
  const { showing } = useKBar((state) => ({
    showing: state.visualState !== VisualState.hidden,
  }));

  if (!showing) {
    return null;
  }

  return <Portal container={container}>{children}</Portal>;
}
