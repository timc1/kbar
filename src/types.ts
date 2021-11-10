import * as React from "react";
import type { ActionImpl } from "./action";

export type ActionId = string;

export interface BaseAction {
  id: ActionId;
  name: string;
  shortcut?: string[];
  keywords?: string;
  section?: string;
  icon?: string | React.ReactElement | React.ReactNode;
  subtitle?: string;
  perform?: () => void;
  parent?: ActionId;
}

export type Action = Omit<BaseAction, "parent"> & {
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
  /**
   * `disableScrollBarManagement` ensures that kbar will not
   * manipulate the document's `margin-right` property when open.
   * By default, kbar will add additional margin to the document
   * body when opened in order to prevent any layout shift with
   * the appearance/disappearance of the scrollbar.
   */
  disableScrollbarManagement?: boolean;
  callbacks?: {
    onOpen?: () => void;
    onClose?: () => void;
    onQueryChange?: (searchQuery: string) => void;
    onSelectAction?: (action: ActionImpl) => void;
  };
}

export interface KBarProviderProps {
  actions: BaseAction[];
  options?: KBarOptions;
}

export interface KBarState {
  searchQuery: string;
  visualState: VisualState;
  actions: ActionTree;
  currentRootActionId?: ActionId | null;
  activeIndex: number;
}

export interface KBarQuery {
  setCurrentRootAction: (actionId?: ActionId | null) => void;
  setVisualState: (
    cb: ((vs: VisualState) => VisualState) | VisualState
  ) => void;
  setSearch: (search: string) => void;
  registerActions: (actions: BaseAction[]) => () => void;
  toggle: () => void;
  setActiveIndex: (cb: number | ((currIndex: number) => number)) => void;
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
