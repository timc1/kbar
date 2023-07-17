import { deepEqual } from "fast-equals";
import * as React from "react";
import invariant from "tiny-invariant";
import { ActionInterface } from "./action/ActionInterface";
import { history } from "./action/HistoryImpl";
import type {
  Action,
  IKBarContext,
  KBarOptions,
  KBarProviderProps,
  KBarQuery,
  KBarState,
} from "./types";
import { VisualState } from "./types";

type useStoreProps = KBarProviderProps;

export function useStore(props: useStoreProps) {
  const optionsRef = React.useRef({
    animations: {
      enterMs: 200,
      exitMs: 100,
    },
    ...props.options,
  } as KBarOptions);

  const actionsInterface = React.useMemo(
    () =>
      new ActionInterface(props.actions || [], {
        historyManager: optionsRef.current.enableHistory ? history : undefined,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // TODO: at this point useReducer might be a better approach to managing state.
  const [state, setState] = React.useState<KBarState>({
    searchQuery: "",
    currentRootActionId: null,
    visualState: VisualState.hidden,
    actions: { ...actionsInterface.actions },
    activeIndex: 0,
    disabled: false,
  });

  const currState = React.useRef(state);
  currState.current = state;

  const getState = React.useCallback(() => currState.current, []);
  const publisher = React.useMemo(() => new Publisher(getState), [getState]);

  React.useEffect(() => {
    currState.current = state;
    publisher.notify();
  }, [state, publisher]);

  const registerActions = React.useCallback(
    (actions: Action[]) => {
      setState((state) => {
        return {
          ...state,
          actions: actionsInterface.add(actions),
        };
      });

      return function unregister() {
        setState((state) => {
          return {
            ...state,
            actions: actionsInterface.remove(actions),
          };
        });
      };
    },
    [actionsInterface]
  );

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return React.useMemo(() => {
    const query: KBarQuery = {
      setCurrentRootAction: (actionId) => {
        setState((state) => ({
          ...state,
          currentRootActionId: actionId,
        }));
      },
      setVisualState: (cb) => {
        setState((state) => ({
          ...state,
          visualState: typeof cb === "function" ? cb(state.visualState) : cb,
        }));
      },
      setSearch: (searchQuery) =>
        setState((state) => ({
          ...state,
          searchQuery,
        })),
      registerActions,
      toggle: () =>
        setState((state) => ({
          ...state,
          visualState: [VisualState.animatingOut, VisualState.hidden].includes(
            state.visualState
          )
            ? VisualState.animatingIn
            : VisualState.animatingOut,
        })),
      setActiveIndex: (cb) =>
        setState((state) => ({
          ...state,
          activeIndex: typeof cb === "number" ? cb : cb(state.activeIndex),
        })),
      inputRefSetter: (el: HTMLInputElement) => {
        inputRef.current = el;
      },
      getInput: () => {
        invariant(
          inputRef.current,
          "Input ref is undefined, make sure you attach `query.inputRefSetter` to your search input."
        );
        return inputRef.current;
      },
      disable: (disable: boolean) => {
        setState((state) => ({
          ...state,
          disabled: disable,
        }));
      },
    };
    return {
      getState,
      query,
      options: optionsRef.current,
      subscribe: (collector, cb) => publisher.subscribe(collector, cb),
    } as IKBarContext;
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
