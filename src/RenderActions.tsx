import * as React from "react";
import type { Action } from "./types";

export interface RenderActionsProps {
  actions: Action[];
}

export default function RenderActions(props: RenderActionsProps) {
  if (!props.actions.length) {
    return null;
  }

  return <div>RenderActions {props.actions.length}</div>;
}
