import * as React from "react";
import type { ActionImpl } from "./action/ActionImpl";
import { useThrottledValue } from "./utils";
import Fuse from "fuse.js";
import { Match, Matcher } from "./types";

export const SKIP_ORIGINAL_MATCHER = Symbol("SKIP_ORIGINAL_MATCHER");
export const fuseOptions: Fuse.IFuseOptions<ActionImpl> = {
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
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  minMatchCharLength: 1,
};

export function useInternalMatches(
  filtered: ActionImpl[],
  search: string,
  matcher?: Matcher
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
    let {matches, search} = matcher && typeof matcher === 'function' ? matcher(throttledFiltered, throttledSearch) : {search: throttledSearch, matches: []};

    if (search === SKIP_ORIGINAL_MATCHER) {
        return matches;
    }

    if(typeof search === 'symbol') {
      throw new Error('Invalid search value, the custom matcher must return a string or SKIP_ORIGINAL_MATCHER symbol');
    }

    if (typeof search === 'string' && search.trim() === "") {
      return throttledFiltered.map((action) => ({ score: 0, action }));
    }

    search = search as string | Fuse.Expression;

    const fuse = new Fuse(throttledFiltered, fuseOptions);

    // Use Fuse's `search` method to perform the search efficiently
    const searchResults = fuse.search(search);
    // Format the search results to match the existing structure
    searchResults.forEach(({ item: action, score }) => {
      const match = matches.find((match) => match.action.id === action.id);
      if (match) {
        match.score = 1 / ((score ?? 0) + 1); // Convert the Fuse score to the format used in the original code
      } else {
        matches.push({
          score: 1 / ((score ?? 0) + 1), // Convert the Fuse score to the format used in the original code
          action,
        });
      }
    });

    return matches;
  }, [throttledFiltered, throttledSearch, matcher]) as Match[];
}
