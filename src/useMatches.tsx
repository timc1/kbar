import * as React from "react";
import type { ActionImpl } from "./action/ActionImpl";
import { useKBar } from "./useKBar";
import { Priority, useThrottledValue } from "./utils";
import Fuse from "fuse.js";

export const NO_GROUP = {
  name: "none",
  priority: Priority.NORMAL,
};

const fuseOptions: Fuse.IFuseOptions<ActionImpl> = {
  keys: [
    {
      name: "name",
      weight: 0.5,
    },
    {
      name: "keywords",
      getFn: (item) => (item.keywords ?? "").split(","),
      weight: 0.5,
    },
    "subtitle",
  ],
  ignoreLocation: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  minMatchCharLength: 1,
};

function order(a, b) {
  /**
   * Larger the priority = higher up the list
   */
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
    return Object.keys(actions)
      .reduce((acc, actionId) => {
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
      }, [] as ActionImpl[])
      .sort(order);
  }, [actions, rootActionId]);

  const getDeepResults = React.useCallback((actions: ActionImpl[]) => {
    let actionsClone: ActionImpl[] = [];
    for (let i = 0; i < actions.length; i++) {
      actionsClone.push(actions[i]);
    }
    return (function collectChildren(
      actions: ActionImpl[],
      all = actionsClone
    ) {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].children.length > 0) {
          let childsChildren = actions[i].children;
          for (let i = 0; i < childsChildren.length; i++) {
            all.push(childsChildren[i]);
          }
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

  const fuse = React.useMemo(() => new Fuse(filtered, fuseOptions), [filtered]);

  const matches = useInternalMatches(filtered, search, fuse);

  const results = React.useMemo(() => {
    /**
     * Store a reference to a section and it's list of actions.
     * Alongside these actions, we'll keep a temporary record of the
     * final priority calculated by taking the commandScore + the
     * explicitly set `action.priority` value.
     */
    let map: Record<SectionName, { priority: number; action: ActionImpl }[]> =
      {};
    /**
     * Store another reference to a list of sections alongside
     * the section's final priority, calculated the same as above.
     */
    let list: { priority: number; name: SectionName }[] = [];
    /**
     * We'll take the list above and sort by its priority. Then we'll
     * collect all actions from the map above for this specific name and
     * sort by its priority as well.
     */
    let ordered: { name: SectionName; actions: ActionImpl[] }[] = [];

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const action = match.action;
      const score = match.score || Priority.NORMAL;

      const section = {
        name:
          typeof action.section === "string"
            ? action.section
            : action.section?.name || NO_GROUP.name,
        priority:
          typeof action.section === "string"
            ? score
            : action.section?.priority || 0 + score,
      };

      if (!map[section.name]) {
        map[section.name] = [];
        list.push(section);
      }

      map[section.name].push({
        priority: action.priority + score,
        action,
      });
    }

    ordered = list.sort(order).map((group) => ({
      name: group.name,
      actions: map[group.name].sort(order).map((item) => item.action),
    }));

    /**
     * Our final result is simply flattening the ordered list into
     * our familiar (ActionImpl | string)[] shape.
     */
    let results: (string | ActionImpl)[] = [];
    for (let i = 0; i < ordered.length; i++) {
      let group = ordered[i];
      if (group.name !== NO_GROUP.name) results.push(group.name);
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

type Match = {
  action: ActionImpl;
  /**
   * Represents the commandScore matchiness value which we use
   * in addition to the explicitly set `action.priority` to
   * calculate a more fine tuned fuzzy search.
   */
  score: number;
};

function useInternalMatches(
  filtered: ActionImpl[],
  search: string,
  fuse: Fuse<ActionImpl>
) {
  const value = React.useMemo(
    () => ({
      filtered,
      search,
    }),
    [filtered, search]
  );

  const { filtered: throttledFiltered, search: throttledSearch } =
    useThrottledValue(value);

  return React.useMemo(() => {
    if (throttledSearch.trim() === "") {
      return throttledFiltered.map((action) => ({ score: 0, action }));
    }

    let matches: Match[] = [];
    // Use Fuse's `search` method to perform the search efficiently
    const searchResults = fuse.search(throttledSearch);
    // Format the search results to match the existing structure
    matches = searchResults.map(({ item: action, score }) => ({
      score: 1 / ((score ?? 0) + 1), // Convert the Fuse score to the format used in the original code
      action,
    }));

    return matches;
  }, [throttledFiltered, throttledSearch, fuse]) as Match[];
}

/**
 * @deprecated use useMatches
 */
export const useDeepMatches = useMatches;
