import * as React from "react";
import { useHistory } from "react-router";
import useRegisterActions from "../../src/useRegisterActions";
import { createAction } from "../../src/utils";
import data from "./Docs/data";

const rootSearchAction = createAction({
  name: "Search docs…",
  shortcut: ["?"],
  keywords: "find",
  section: "",
});

export default function SearchDocsActions() {
  const history = useHistory();

  const searchActions = React.useMemo(() => {
    let actions = [];
    const collectDocs = (tree) => {
      Object.keys(tree).forEach((key) => {
        const curr = tree[key];
        if (curr.children) {
          collectDocs(curr.children);
        }
        if (curr.component) {
          actions.push(
            createAction({
              parent: rootSearchAction.id,
              name: curr.name,
              shortcut: [],
              keywords: "",
              perform: () => history.push(curr.slug),
            })
          );
        }
      });
      return actions;
    };
    return collectDocs(data);
  }, [history]);

  useRegisterActions([rootSearchAction, ...searchActions].filter(Boolean));

  return null;
}
