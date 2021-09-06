import * as React from "react";

export enum VisualState {
  animatingIn = "animating-in",
  showing = "showing",
  animatingOut = "animating-out",
  hidden = "hidden",
}

export type ActionId = string;

export interface Action {
  id: string;
  name: string;
  shortcut: string[];
  keywords: string;
  perform?: () => void;
  section?: string;
  parent: ActionId;
  children?: ActionId[];
}
