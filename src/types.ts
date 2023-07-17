import * as React from "react";
import { ActionImpl } from "./action/ActionImpl";

export type ActionId = string;

export type Priority = number;

export type ActionSection =
  | string
  | {
      name: string;
      priority: Priority;
    };

export type Action = {
  id: ActionId;
  name: string;
  shortcut?: string[];
  keywords?: string;
  section?: ActionSection;
  icon?: string | React.ReactElement | React.ReactNode;
  subtitle?: string;
  perform?: (currentActionImpl: ActionImpl) => any;
  parent?: ActionId;
  priority?: Priority;
};

export type ActionStore = Record<ActionId, ActionImpl>;

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
  callbacks?: {
    onOpen?: () => void;
    onClose?: () => void;
    onQueryChange?: (searchQuery: string) => void;
    onSelectAction?: (action: ActionImpl) => void;
  };
  /**
   * `disableScrollBarManagement` ensures that kbar will not
   * manipulate the document's `margin-right` property when open.
   * By default, kbar will add additional margin to the document
   * body when opened in order to prevent any layout shift with
   * the appearance/disappearance of the scrollbar.
   */
  disableScrollbarManagement?: boolean;
  /**
   * `disableDocumentLock` disables the "document lock" functionality
   * of kbar, where the body element's scrollbar is hidden and pointer
   * events are disabled when kbar is open. This is useful if you're using
   * a custom modal component that has its own implementation of this
   * functionality.
   */
  disableDocumentLock?: boolean;
  enableHistory?: boolean;
  /**
   * `toggleShortcut` enables customizing which keyboard shortcut triggers
   * kbar. Defaults to "$mod+k" (cmd+k / ctrl+k)
   */
  toggleShortcut?: string;
}

export interface KBarProviderProps {
  actions?: Action[];
  options?: KBarOptions;
}

export interface KBarState {
  searchQuery: string;
  visualState: VisualState;
  actions: ActionTree;
  currentRootActionId?: ActionId | null;
  activeIndex: number;
  disabled: boolean;
}

export interface KBarQuery {
  setCurrentRootAction: (actionId?: ActionId | null) => void;
  setVisualState: (
    cb: ((vs: VisualState) => VisualState) | VisualState
  ) => void;
  setSearch: (search: string) => void;
  registerActions: (actions: Action[]) => () => void;
  toggle: () => void;
  setActiveIndex: (cb: number | ((currIndex: number) => number)) => void;
  inputRefSetter: (el: HTMLInputElement) => void;
  getInput: () => HTMLInputElement;
  disable: (disable: boolean) => void;
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

export interface HistoryItem {
  perform: () => any;
  negate: () => any;
}

export interface History {
  undoStack: HistoryItem[];
  redoStack: HistoryItem[];
  add: (item: HistoryItem) => HistoryItem;
  remove: (item: HistoryItem) => void;
  undo: (item?: HistoryItem) => void;
  redo: (item?: HistoryItem) => void;
  reset: () => void;
}
