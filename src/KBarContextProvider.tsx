import { deepEqual } from "fast-equals";
import React from "react";
import InternalKeyboardEvents from "./InternalKeyboardEvents";
import {
  ActionId,
  IKBarContext,
  KBarProviderProps,
  KBarState,
  VisualState,
} from "./types";

export const KBarContext = React.createContext<IKBarContext>(
  {} as IKBarContext
);

export const KBarProvider: React.FC<KBarProviderProps> = (props) => {
  const [state, setState] = React.useState<KBarState>({
    searchQuery: "",
    currentRootActionId: null,
    visualState: VisualState.hidden,
  });

  const currState = React.useRef(state);
  currState.current = state;

  const getState = React.useCallback(() => currState.current, []);
  const publisher = React.useMemo(() => new Publisher(getState), []);

  React.useEffect(() => {
    currState.current = state;
    publisher.notify();
  }, [state]);

  const optionsRef = React.useRef(props.options || {});
  const actionsRef = React.useRef(props.actions || {});

  const contextValue = React.useMemo(
    () => ({
      getState,
      actions: actionsRef.current,
      query: {
        setCurrentRootAction: (actionId: ActionId | null | undefined) => {
          setState((state) => ({
            ...state,
            currentRootActionId: actionId,
          }));
        },
        setVisualState: (
          cb: ((vs: VisualState) => VisualState) | VisualState
        ) => {
          setState((state) => ({
            ...state,
            visualState: typeof cb === "function" ? cb(state.visualState) : cb,
          }));
        },
        setSearch: (searchQuery: string) =>
          setState((state) => ({
            ...state,
            searchQuery,
          })),
      },
      options: optionsRef.current,
      subscribe: (
        collector: <C>(state: KBarState) => C,
        cb: <C>(collected: C) => void
      ) => publisher.subscribe(collector, cb),
    }),
    [getState, publisher]
  );

  return (
    <KBarContext.Provider value={contextValue}>
      <InternalKeyboardEvents />
      {props.children}
    </KBarContext.Provider>
  );
};

// pub/sub https://github.com/prevwong/craft.js
class Publisher {
  getState;
  subscribers: Subscriber[] = [];

  constructor(getState: () => KBarState) {
    this.getState = getState;
  }

  subscribe<C>(
    collector: (state: KBarState) => C,
    onChange: (collected: C) => void
  ) {
    const subscriber = new Subscriber(
      () => collector(this.getState()),
      onChange
    );
    this.subscribers.push(subscriber);
    return this.unsubscribe.bind(this, subscriber);
  }

  unsubscribe(subscriber: Subscriber) {
    if (this.subscribers.length) {
      const index = this.subscribers.indexOf(subscriber);
      if (index > -1) {
        return this.subscribers.splice(index, 1);
      }
    }
  }

  notify() {
    this.subscribers.forEach((subscriber) => subscriber.collect());
  }
}

class Subscriber {
  collected: any;
  collector;
  onChange;

  constructor(collector: () => any, onChange: (collected: any) => any) {
    this.collector = collector;
    this.onChange = onChange;
  }

  collect() {
    try {
      // grab latest state
      const recollect = this.collector();
      if (!deepEqual(recollect, this.collected)) {
        this.collected = recollect;
        if (this.onChange) {
          this.onChange(this.collected);
        }
      }
    } catch (error) {
      console.warn(error);
    }
  }
}
