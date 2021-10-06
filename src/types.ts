import * as React from "react";

export type ActionId = string;

export interface Action {
  id: string;
  name: string;
  shortcut: string[];
  keywords: string;
  regex?: RegExp;
  perform?: () => void;
  section?: string;
  parent?: ActionId | null | undefined;
  children?: ActionId[];
  icon?: string | React.ReactElement | React.ReactNode;
  subtitle?: string;
}

export type ActionTree = Record<string, Action>;

export interface KBarOptions {
  animations?: {
    enterMs?: number;
    exitMs?: number;
  };
}

export interface KBarProviderProps {
  actions: Action[];
  options?: KBarOptions;
}

export interface KBarState {
  searchQuery: string;
  // TODO: simplify type
  currentRootActionId: ActionId | null | undefined;
  visualState: VisualState;
  actions: ActionTree;
}

export interface KBarQuery {
  setCurrentRootAction: (actionId: ActionId | null | undefined) => void;
  setVisualState: (cb: ((vs: VisualState) => any) | VisualState) => void;
  setSearch: (search: string) => void;
  registerActions: (actions: Action[]) => () => void;
}

export interface IKBarContext {
  getState: () => KBarState;
  query: KBarQuery;
  subscribe: (
    collector: <C>(state: KBarState) => C,
    cb: <C>(collected: C) => void
  ) => void;
  options: KBarOptions;
}

export enum VisualState {
  animatingIn = "animating-in",
  showing = "showing",
  animatingOut = "animating-out",
  hidden = "hidden",
}

export interface ResultHandlers {
  onClick: () => void;
  onMouseEnter: () => void;
  onPointerDown: () => void;
}

export interface ResultState {
  index: number;
  activeIndex: number;
}

export interface KBarResultsProps {
  style?: React.CSSProperties;
  className?: string;
  onRender?: (
    action: Action,
    handlers: ResultHandlers,
    state: ResultState
  ) => React.ReactElement;
}
