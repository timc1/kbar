import * as React from "react";
import ActionImpl from "./action/ActionImpl";

export type ActionId = string;

export interface Action {
  id: ActionId;
  name: string;
  shortcut?: string[];
  keywords?: string;
  perform?: () => void;
  section?: string;
  parent?: ActionId | null | undefined;
  icon?: string | React.ReactElement | React.ReactNode;
  subtitle?: string;
}

export type IAction = Omit<Action, "parent" | "children"> & {
  parent?: ActionImpl;
  children?: ActionImpl[];
};

export type ActionTree = Record<string, ActionImpl>;

export interface ActionGroup {
  name: string;
  actions: ActionImpl[];
}

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
