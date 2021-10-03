import { matchSorter } from "match-sorter";
import * as React from "react";
import { VisualState } from ".";
import type { Action } from "./types";
import useKBar from "./useKBar";

interface KBarGroupedResultsProps {
  className?: string;
  style?: React.CSSProperties;
  onRender?: () => React.ReactElement;
}

const noGroup = "noGroup";
const groupHeaderStyle: React.CSSProperties = {
  padding: "4px 16px",
  background: "rgb(238 238 238 / 25%)",
  fontSize: "10px",
  textTransform: "uppercase",
};

export default function KBarGroupedResults(props: KBarGroupedResultsProps) {
  const { actions, currentRootActionId, search } = useKBar((state) => ({
    actions: state.actions,
    currentRootActionId: state.currentRootActionId,
    search: state.searchQuery,
  }));

  const list = React.useMemo(
    () => Object.keys(actions).map((key) => actions[key]),
    [actions]
  );

  const filtered = React.useMemo(() => {
    if (!currentRootActionId) {
      return list.filter((action) => !action.parent);
    }

    const parent = actions[currentRootActionId];
    if (!parent) {
      return [];
    }

    const children = parent.children;
    if (!children?.length) {
      return [];
    }

    return children.map((actionId) => actions[actionId]);
  }, [list, actions, currentRootActionId]);

  const matches = useMatches(filtered, search);

  const grouped = React.useMemo(
    () =>
      matches.reduce((acc, curr) => {
        if (curr.section) {
          if (!acc[curr.section]) {
            acc[curr.section] = [];
          }
          acc[curr.section].push(curr);
        } else {
          if (!acc[noGroup]) {
            acc[noGroup] = [];
          }
          acc[noGroup].push(curr);
        }
        return acc;
      }, {} as Record<string, Action[]>),
    [matches]
  );

  return (
    <div className={props.className} style={props.style}>
      <RenderResults results={grouped} />
    </div>
  );
}

function RenderResults({ results }: { results: Record<string, Action[]> }) {
  const groups = Object.keys(results);

  const flattened = groups.reduce((acc, name) => {
    const actions = results[name];
    acc.push(...actions);
    return acc;
  }, [] as Action[]);

  const { activeIndex, getResultProps } =
    useCurrentActiveResultIndex(flattened);

  if (!groups.length) {
    return null;
  }

  let index = 0;

  return (
    <>
      {groups.map((name) => {
        const actions = results[name];
        return (
          <div key={name}>
            {name !== noGroup && <div style={groupHeaderStyle}>{name}</div>}
            {actions.map((action) => {
              const currIndex = index;
              index++;

              const active = currIndex === activeIndex;

              return (
                <div
                  key={action.id}
                  style={{
                    background: active ? "#eee" : "#fff",
                    borderLeft: `2px solid ${active ? "#000" : "transparent"}`,
                  }}
                  {...getResultProps(currIndex)}
                >
                  {action.name}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function useMatches(list: Action[], term: string) {
  return React.useMemo(
    () =>
      term.trim() === ""
        ? list
        : matchSorter(list, term, { keys: ["keywords", "name", "subtitle"] }),
    [list, term]
  );
}

function useCurrentActiveResultIndex(results: Action[]) {
  const { actions, query, currentRootActionId } = useKBar((state) => ({
    actions: state.actions,
    currentRootActionId: state.currentRootActionId,
  }));
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [currentRootActionId]);

  const select = React.useCallback(() => {
    const action = actions[results[activeIndex].id];
    if (!action) return;
    if (action.perform) {
      action.perform();
      query.setVisualState(VisualState.animatingOut);
    } else if (action.children) {
      query.setCurrentRootAction(action.id);
    }
  }, [actions, activeIndex, results, query]);

  React.useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key;
      if (key === "ArrowDown" || (event.ctrlKey && key === "n")) {
        event.preventDefault();
        setActiveIndex((index) =>
          index < results.length - 1 ? (index += 1) : 0
        );
        return;
      }

      if (key === "ArrowUp" || (event.ctrlKey && key === "p")) {
        event.preventDefault();
        setActiveIndex((index) =>
          index > 0 ? (index -= 1) : results.length - 1
        );
        return;
      }

      if (key === "Enter") {
        event.preventDefault();
        select();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [results.length, select]);

  const getResultProps = React.useCallback(
    (index: number) => {
      const props = {
        onClick: select,
        onPointerDown: () => setActiveIndex(index),
        onMouseEnter: () => setActiveIndex(index),
      };

      if (index === activeIndex) {
        props["data-kbar-active"] = true;
      }

      return props;
    },
    [query, select, activeIndex]
  );

  return { activeIndex, getResultProps };
}
