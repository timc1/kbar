import { deepEqual } from "fast-equals";
import * as React from "react";
import ActionInterface from "./action/ActionInterface";
import {
  Action,
  ActionId,
  KBarProviderProps,
  KBarState,
  KBarOptions,
  VisualState,
} from "./types";

type useStoreProps = KBarProviderProps;

export default function useStore(
  props: useStoreProps = {
    actions: [],
  }
) {
  const actionsInterfaceRef = React.useRef(new ActionInterface(props.actions));

  const [state, setState] = React.useState<KBarState>({
    searchQuery: "",
    currentRootActionId: null,
    visualState: VisualState.hidden,
    actions: { ...actionsInterfaceRef.current.actions },
  });

  const currState = React.useRef(state);
  currState.current = state;

  const getState = React.useCallback(() => currState.current, []);
  const publisher = React.useMemo(() => new Publisher(getState), [getState]);

  React.useEffect(() => {
    currState.current = state;
    publisher.notify();
  }, [state, publisher]);

  const optionsRef = React.useRef({
    animations: {
      enterMs: 200,
      exitMs: 100,
    },
    ...props.options,
  } as KBarOptions);

  const registerActions = React.useCallback((actions: Action[]) => {
    setState((state) => ({
      ...state,
      actions: { ...actionsInterfaceRef.current.add(actions) },
    }));

    return function unregister() {
      setState((state) => ({
        ...state,
        actions: { ...actionsInterfaceRef.current.remove(actions) },
      }));
    };
  }, []);

  return React.useMemo(() => {
    return {
      getState,
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
        registerActions,
        toggle: () =>
          setState((state) => ({
            ...state,
            visualState: [
              VisualState.animatingOut,
              VisualState.hidden,
            ].includes(state.visualState)
              ? VisualState.animatingIn
              : VisualState.animatingOut,
          })),
      },
      options: optionsRef.current,
      subscribe: (
        collector: <C>(state: KBarState) => C,
        cb: <C>(collected: C) => void
      ) => publisher.subscribe(collector, cb),
    };
  }, [getState, publisher, registerActions]);
}

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
