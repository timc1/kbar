import { matchSorter } from "match-sorter";
import * as React from "react";
import { useKBar } from ".";
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
    return (function collectChildren(
      actions: ActionImpl[],
      all = [...actions]
    ) {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].children.length > 0) {
          all.push(...actions[i].children);
          collectChildren(actions[i].children, all);
        }
      }
      return all;
    })(actions);
  }, []);

  const emptySearch = !search;

  const filtered = React.useMemo(() => {
    if (emptySearch) return rootResults;
    return getDeepResults(rootResults);
  }, [getDeepResults, rootResults, emptySearch]);

  const matches = useInternalMatches(filtered, search);

  const results = React.useMemo(() => {
    let groupMap: Record<string, ActionImpl[]> = {};
    for (let i = 0; i < matches.length; i++) {
      const action = matches[i];
      const section = action.section || NO_GROUP;
      if (!groupMap[section]) {
        groupMap[section] = [];
      }
      groupMap[section].push(action);
    }

    let results: (string | ActionImpl)[] = [];
    Object.keys(groupMap).forEach((name) => {
      if (name !== NO_GROUP) results.push(name);
      const actions = groupMap[name];
      for (let i = 0; i < actions.length; i++) {
        results.push(actions[i]);
      }
    });

    return results;
  }, [matches]);

  // ensure that users have an accurate `currentRootActionId`
  // that syncs with the throttled return value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoRootActionId = React.useMemo(() => rootActionId, [results]);

  return React.useMemo(
    () => ({
      results,
      rootActionId: memoRootActionId,
    }),
    [memoRootActionId, results]
  );
}

function useInternalMatches(filtered: ActionImpl[], search: string) {
  const value = React.useMemo(
    () => ({
      filtered,
      search,
    }),
    [filtered, search]
  );

  const { filtered: throttledFiltered, search: throttledSearch } =
    useThrottledValue(value);

  return React.useMemo(
    () =>
      throttledSearch.trim() === ""
        ? throttledFiltered
        : matchSorter(throttledFiltered, throttledSearch, {
            keys: ["name", "keywords", "subtitle"],
          }),
    [throttledFiltered, throttledSearch]
  ) as ActionImpl[];
}
