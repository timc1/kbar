import { matchSorter } from "match-sorter";
import * as React from "react";
import { ActionId, useKBar } from ".";
import { ActionImpl } from "./action";

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
      actions.forEach((action) => {
        if (action.children.length > 0) {
          all.push(...action.children);
          collectChildren(action.children);
        }
      });
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

  return groups;
}

function useInternalMatches(filtered: ActionImpl[], search: string) {
  // const throttledFiltered = useThrottledValue(filtered);
  // const throttledSearch = useThrottledValue(search);

  return React.useMemo(
    () =>
      search.trim() === ""
        ? filtered
        : matchSorter(filtered, search, {
            keys: ["name", "keywords", "subtitle"],
          }),
    [filtered, search]
  );
}

// function useThrottledValue(value: any, ms: number = 100) {
//   const [throttledValue, setThrottledValue] = React.useState(value);
//   const lastRan = React.useRef(Date.now());

//   React.useEffect(() => {
//     const timeout = setTimeout(() => {
//       setThrottledValue(value);
//       lastRan.current = Date.now();
//     }, lastRan.current - (Date.now() - ms));

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, [ms, value]);

//   return throttledValue;
// }
