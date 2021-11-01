import { matchSorter } from "match-sorter";
import * as React from "react";
import type { ActionImpl } from "./action/ActionImpl";
import type { ActionGroup, ActionTree } from "./types";
import useKBar from "./useKBar";

export const NO_GROUP = "none";

export default function useMatches() {
  const { actions, search, rootActionId } = useKBar((state) => ({
    actions: state.actions,
    search: state.searchQuery,
    rootActionId: state.currentRootActionId,
  }));

  const filtered = React.useMemo(() => {
    return Object.keys(actions).reduce((acc, actionId) => {
      const action = actions[actionId];
      if (!action.parent && !rootActionId) {
        acc[actionId] = action;
      }

      if (action.parent?.id === rootActionId) {
        acc[actionId] = action;
      }
      return acc;
    }, {});
  }, [actions, rootActionId]);

  const matches = useInternalMatches(filtered, search);

  const groups = React.useMemo(() => {
    const groupMap = matches.reduce((acc, action) => {
      const section = action.section || NO_GROUP;
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(action);
      return acc;
    }, {} as Record<string, ActionImpl[]>);

    let groups: ActionGroup[] = [];

    Object.keys(groupMap).forEach((name) => {
      const actions = groupMap[name];
      groups.push({ name, actions });
    });

    return groups;
  }, [matches]);

  return groups;
}

function useInternalMatches(actions: ActionTree, search: string) {
  // matchSorter returns an unstable array each time it is called.
  // We throttle here to limit the calls to a reasonable amount.
  const throttled = useThrottled(search, 100);

  const list = React.useMemo(
    () => Object.keys(actions).map((key) => actions[key]),
    [actions]
  );

  return React.useMemo(
    () =>
      search.trim() === ""
        ? list
        : matchSorter(list, throttled, {
            keys: ["name", "keywords", "subtitle"],
          }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [throttled, list]
  );
}

function useThrottled(value: string, ms: number) {
  const [throttled, setThrottled] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setThrottled(value);
      lastRan.current = Date.now();
    }, lastRan.current - (Date.now() - ms));

    return () => clearTimeout(timeout);
  }, [ms, value]);

  return throttled;
}
