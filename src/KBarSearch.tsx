import { matchSorter } from "match-sorter";
import RenderActions from "./RenderActions";
import * as React from "react";
import { Action } from "./types";
import { swallowEvent } from "./utils";

export interface KBarSearchProps {
  actions: Record<string, Action>;
  onRequestClose: () => void;
}

const KBarSearch: React.FC<KBarSearchProps> = (props) => {
  const [search, setSearch] = React.useState("");

  const actionsList = React.useMemo(
    () =>
      Object.keys(props.actions).map((actionKey) => props.actions[actionKey]),
    []
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
      <RenderActions actions={matches} onRequestClose={props.onRequestClose} />
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
    [term]
  );
}
