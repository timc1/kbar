import { matchSorter } from "match-sorter";
import React from "react";
import { Action } from "./types";
import useKBar from "./useKBar";

interface KBarResultsProps {
  onRender?: (action: Action) => React.ReactNode;
}

export default function KBarResults(props: KBarResultsProps) {
  const { search, actions, currentRootActionId, query } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
  }));

  const currActions = React.useMemo(() => {
    if (!currentRootActionId) {
      return actions;
    }

    const root = actions[currentRootActionId];
    const children = root.children;

    if (!children) {
      return root;
    }

    return {
      ...children.reduce((acc, actionId) => {
        acc[actionId] = actions[actionId];
        return acc;
      }, {}),
    };
  }, [actions, currentRootActionId]);

  console.log({ currActions });

  const actionsList = React.useMemo(
    () =>
      Object.keys(currActions).map((key) => {
        const action = currActions[key];
        return action;
      }) as Action[],
    [currActions]
  );

  const matches = useMatches(search, actionsList);

  console.log({ matches });

  const [activeIndex, setActiveIndex] = React.useState(0);

  const select = React.useCallback(() => {
    const action = matches[activeIndex];

    if (action.perform) {
      action.perform();
    } else {
      query.setCurrentRootAction(action.id);
    }
  }, [matches, activeIndex, query]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      event.stopPropagation();

      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        setActiveIndex((index) => {
          if (index >= actionsList.length - 1) {
            return 0;
          } else {
            return index + 1;
          }
        });
      }

      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        setActiveIndex((index) => {
          if (index === 0) {
            return actionsList.length - 1;
          } else {
            return index - 1;
          }
        });
      }

      if (event.key === "Enter") {
        select();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actionsList, select, activeIndex]);

  // Reset focused index when searching & updated results.
  React.useEffect(() => {
    setActiveIndex(0);
  }, [actionsList.length, search]);

  return (
    <>
      {matches.length
        ? matches.map((action, index) => {
            return (
              <div
                key={action.id}
                onClick={select}
                style={{
                  background: activeIndex === index ? "#eee" : "#fff",
                }}
              >
                {action.name}
              </div>
            );
          })
        : null}
    </>
  );
}

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
