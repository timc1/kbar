export enum VisualState {
  animatingIn = "animating-in",
  showing = "showing",
  animatingOut = "animating-out",
  hidden = "hidden",
}

export interface Action {
  id: string;
  name: string;
  shortcut: string[];
  keywords: string;
  perform: (context: ActionContext) => void;
  group?: string;
}

export interface ActionContext {}
