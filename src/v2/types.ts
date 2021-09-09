export type ActionId = string;

export interface Action {
  id: string;
  name: string;
  shortcut: string[];
  keywords: string;
  perform?: () => void;
  section?: string;
  parent?: ActionId | null | undefined;
  children?: ActionId[];
}

export type ActionTree = Record<string, Action>;

export interface KBarProviderProps {
  actions: ActionTree;
  options: any;
}

export interface KBarState {
  searchQuery: string;
  // TODO: simplify type
  currentRootActionId: ActionId | null | undefined;
  visualState: VisualState;
}

export interface KBarQuery {
  setCurrentRootAction: (actionId: ActionId | null | undefined) => void;
  setVisualState: (cb: (vs: VisualState) => any) => void;
  setSearch: (search: string) => void;
}

export interface IKBarContext {
  getState: () => KBarState;
  query: KBarQuery;
  actions: ActionTree;
  subscribe: (
    collector: <C>(state: KBarState) => C,
    cb: <C>(collected: C) => void
  ) => void;
  options: any;
}

export enum VisualState {
  animatingIn = "animating-in",
  showing = "showing",
  animatingOut = "animating-out",
  hidden = "hidden",
}
