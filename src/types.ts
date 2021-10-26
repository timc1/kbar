import * as React from "react";
import { ActionImpl } from "./action/ActionImpl";

export type ActionId = string;

export interface BaseAction {
  id: string;
  name: string;
  keywords?: string;
  shortcut?: string[];
  perform?: () => void;
  section?: string;
  parent?: ActionId | null | undefined;
  icon?: string | React.ReactElement | React.ReactNode;
  subtitle?: string;
}

export type Action = BaseAction & {
  children?: ActionImpl[];
};

export type ActionTree = Record<string, ActionImpl>;

export interface ActionGroup {
  name: string;
  actions: BaseAction[];
}

export interface KBarOptions {
  animations?: {
    enterMs?: number;
    exitMs?: number;
  };
}

export interface KBarProviderProps {
  actions: BaseAction[];
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
  registerActions: (actions: BaseAction[]) => () => void;
  toggle: () => void;
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
