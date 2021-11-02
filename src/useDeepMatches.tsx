import { matchSorter } from "match-sorter";
import * as React from "react";
import { ActionId, useKBar } from ".";
import { ActionImpl } from "./action";
import { useThrottledValue } from "./utils";

export const NO_GROUP = "none";

// - nested search only begins when a search query is present
// - combine all children

export default function useDeepMatches() {
  const { search, actions, rootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    actions: state.actions,
    rootActionId: state.currentRootActionId,
  }));

  const rootResults = React.useMemo(() => {
    return Object.keys(actions).reduce((acc, actionId) => {
      const action = actions[actionId];
      if (!action.parent && !rootActionId) {
        acc.push(action);
      }

      if (action.parent && action.parent.id === rootActionId) {
        acc.push(action);
      }

      return acc;
    }, [] as ActionImpl[]);
  }, [actions, rootActionId]);

  const getDeepResults = React.useCallback((actions: ActionImpl[]) => {
    let all: ActionImpl[] = [...actions];
    (function collectChildren(actions: ActionImpl[]) {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].children.length > 0) {
          all.push(...actions[i].children);
          collectChildren(actions[i].children);
        }
      }
    })(actions);
    return all;
  }, []);

  const emptySearch = !search;

  const filtered = React.useMemo(() => {
    if (emptySearch) return rootResults;
    return getDeepResults(rootResults);
  }, [getDeepResults, rootResults, emptySearch]);

  const matches = useInternalMatches(filtered, search);

  const groups = React.useMemo(() => {
    const groupMap = matches.reduce((acc, action) => {
      const section = action.section || NO_GROUP;
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(action);
      return acc;
    }, {} as Record<ActionId, ActionImpl[]>);

    let groups = [] as any;
    Object.keys(groupMap).forEach((name) => {
      const actions = groupMap[name];
      groups.push({ name, actions });
    });

    return groups;
  }, [matches]);

  // ensure that users have an accurate `currentRootActionId`
  // that syncs with the throttled return value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoRootActionId = React.useMemo(() => rootActionId, [groups]);

  const value = React.useMemo(
    () => ({
      throttledGroups: groups,
      throttledRootActionId: memoRootActionId,
    }),
    [groups, memoRootActionId]
  );

  return useThrottledValue(value);
}

function useInternalMatches(filtered: ActionImpl[], search: string) {
  const throttledFiltered = useThrottledValue(filtered);
  const throttledSearch = useThrottledValue(search);

  return React.useMemo(
    () =>
      throttledSearch.trim() === ""
        ? throttledFiltered
        : matchSorter(throttledFiltered, throttledSearch, {
            keys: ["name", "keywords", "subtitle"],
          }),
    [throttledFiltered, throttledSearch]
  );
}
