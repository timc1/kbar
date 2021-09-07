import { matchSorter } from "match-sorter";
import RenderActions from "./RenderActions";
import * as React from "react";
import { Action, ActionId } from "./types";
import { swallowEvent } from "./utils";

export interface KBarSearchProps {
  actions: Record<string, Action>;
  onRequestClose: () => void;
  onRequestParentAction: (actionId: ActionId) => void;
  onUpdateRootAction: (actionId: ActionId) => void;
}

const KBarSearch: React.FC<KBarSearchProps> = (props) => {
  const [search, setSearch] = React.useState("");

  const actionsList = React.useMemo(
    () =>
      Object.keys(props.actions).map((actionKey) => props.actions[actionKey]),
    [props.actions]
  );

  const matches = useMatches(search, actionsList);

  return (
    <div onClick={swallowEvent}>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Backspace" && !search) {
            const currentParent =
              props.actions[Object.keys(props.actions)[0]].parent;
            props.onRequestParentAction(currentParent);
          }
        }}
        placeholder="Type a command or search…"
        autoFocus
      />
      <RenderActions
        actions={matches}
        onRequestClose={props.onRequestClose}
        onUpdateRootAction={(actionId) => {
          setSearch("");
          props.onUpdateRootAction(actionId);
        }}
      />
    </div>
  );
};

export default KBarSearch;

function useMatches(term: string, actions: Action[]) {
  // TODO: we can throttle this if needed
  return React.useMemo(
    () =>
      term.trim() === ""
        ? actions
        : matchSorter(actions, term, { keys: ["keywords"] }),
    [term, actions]
  );
}
