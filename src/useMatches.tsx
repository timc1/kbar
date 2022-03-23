import { matchSorter } from "match-sorter";
import * as React from "react";
import type { ActionImpl } from "./action/ActionImpl";
import { useKBar } from "./useKBar";
import { Priority, useThrottledValue } from "./utils";

export const NO_GROUP = {
  name: "none",
  priority: Priority.LOW,
};

function order(a, b) {
  return b.priority - a.priority;
}

type SectionName = string;

/**
 * returns deep matches only when a search query is present
 */
export function useMatches() {
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
      if (action.id === rootActionId) {
        for (let i = 0; i < action.children.length; i++) {
          acc.push(action.children[i]);
        }
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
    let map: Record<SectionName, ActionImpl[]> = {};
    let list: { name: SectionName; priority: number }[] = [];
    let ordered: { name: SectionName; actions: ActionImpl[] }[] = [];

    for (let i = 0; i < matches.length; i++) {
      const action = matches[i];
      const section =
        typeof action.section === "string"
          ? { name: action.section, priority: Priority.NORMAL }
          : action.section || NO_GROUP;
      if (!map[section.name]) {
        map[section.name] = [];
        list.push(section);
      }
      map[section.name].push(action);
    }

    ordered = list.sort(order).map((group) => ({
      name: group.name,
      actions: map[group.name].sort(order),
    }));

    let results: (string | ActionImpl)[] = [];
    for (let i = 0; i < ordered.length; i++) {
      let group = ordered[i];
      results.push(group.name);
      for (let i = 0; i < group.actions.length; i++) {
        results.push(group.actions[i]);
      }
    }

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

/**
 * @deprecated use useMatches
 */
export const useDeepMatches = useMatches;
