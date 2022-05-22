import * as React from "react";
import { useHistory } from "react-router-dom";
import { Action, useRegisterActions } from "../../../src";
import data from "../Docs/data";

const searchId = randomId();

export default function useDocsActions() {
  const history = useHistory();

  const searchActions = React.useMemo(() => {
    let actions: Action[] = [];
    const collectDocs = (tree) => {
      Object.keys(tree).forEach((key) => {
        const curr = tree[key];
        if (curr.children) {
          collectDocs(curr.children);
        }

        if (curr.component) {
          actions.push({
            id: randomId(),
            parent: searchId,
            name: curr.name,
            shortcut: [],
            keywords: "api reference docs",
            section: curr.section,
            perform: () => history.push(curr.slug),
          });
        }
      });
      return actions;
    };
    return collectDocs(data);
  }, [history]);

  const rootSearchAction = React.useMemo(
    () =>
      searchActions.length
        ? {
            id: searchId,
            name: "Search docs…",
            shortcut: ["?"],
            keywords: "find",
            section: "Documentation",
          }
        : null,
    [searchActions]
  );
  useRegisterActions(
    [rootSearchAction, ...searchActions].filter(Boolean) as Action[]
  );
}

function randomId() {
  return Math.random().toString(36).substring(2, 9);
}
