import { matchSorter } from "match-sorter";
import RenderActions from "./RenderActions";
import * as React from "react";
import { Action, ActionId } from "./types";
import { swallowEvent } from "./utils";

export interface KBarSearchProps {
  actions: Record<string, Action>;
  onRequestClose: () => void;
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
