import { matchSorter } from "match-sorter";
import * as React from "react";
import { Action, VisualState } from "./types";
import useKBar from "./useKBar";

interface Handlers {
  onClick: () => void;
  onMouseEnter: () => void;
}

interface RenderResultState {
  index: number;
  activeIndex: number;
}

interface KBarResultsProps {
  onRender?: (
    action: Action,
    handlers: Handlers,
    state: RenderResultState
  ) => React.ReactNode;
}

export default function KBarResults(props: KBarResultsProps) {
  const { search, actions, currentRootActionId, query, options } = useKBar(
    (state) => ({
      search: state.searchQuery,
      currentRootActionId: state.currentRootActionId,
      actions: state.actions,
    })
  );

  // Store reference to a list of all actions
  const actionsList = React.useMemo(
    () =>
      Object.keys(actions).map((key) => {
        return actions[key];
      }),
    [actions]
  );

  const currActions = React.useMemo(() => {
    if (!currentRootActionId) {
      return actionsList.reduce((acc, curr) => {
        if (!curr.parent) {
          acc[curr.id] = curr;
        }
        return acc;
      }, {});
    }

    const root = actions[currentRootActionId];
    const children = root.children;

    if (!children) {
      return {
        [root.id]: root,
      };
    }

    return {
      ...children.reduce((acc, actionId) => {
        acc[actionId] = actions[actionId];
        return acc;
      }, {}),
    };
  }, [actionsList, currentRootActionId]);

  const filteredList = React.useMemo(
    () =>
      Object.keys(currActions).map((key) => {
        const action = currActions[key];
        return action;
      }) as Action[],
    [currActions]
  );

  const matches = useMatches(search, filteredList);

  const [activeIndex, setActiveIndex] = React.useState(0);

  // Reset active index on root action change
  React.useEffect(() => {
    setActiveIndex(0);
  }, [currentRootActionId]);

  const select = React.useCallback(() => {
    const action = matches[activeIndex];

    if (action.perform) {
      action.perform();
      query.setVisualState(() => VisualState.animatingOut);
    } else {
      query.setCurrentRootAction(action.id);
    }
  }, [matches, activeIndex, query]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      event.stopPropagation();

      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        event.preventDefault();
        setActiveIndex((index) => {
          if (index >= matches.length - 1) {
            return 0;
          } else {
            return index + 1;
          }
        });
      }

      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        setActiveIndex((index) => {
          if (index === 0) {
            return matches.length - 1;
          } else {
            return index - 1;
          }
        });
      }

      if (event.key === "Enter") {
        event.preventDefault();
        select();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [matches, select, activeIndex]);

  // Reset focused index when searching & updated results.
  React.useEffect(() => {
    setActiveIndex(0);
  }, [filteredList.length, search]);

  return (
    <div
      style={{
        maxHeight: options?.animations?.maxContentHeight || 400,
        overflow: "auto",
      }}
    >
      {matches.length
        ? matches.map((action, index) => {
            const handlers = {
              key: action.id,
              onClick: select,
              onPointerDown: () => setActiveIndex(index),
              onMouseEnter: () => setActiveIndex(index),
            };

            const state = {
              activeIndex,
              index,
            };

            if (props.onRender) {
              return props.onRender(action, handlers, state);
            }

            return (
              <DefaultResultWrapper
                isActive={activeIndex === index}
                {...handlers}
              >
                {action.name}
              </DefaultResultWrapper>
            );
          })
        : null}
    </div>
  );
}

// Separate component to ensure we can scrollTo active elements properly.
const DefaultResultWrapper: React.FC<{ isActive: boolean }> = ({
  isActive,
  children,
  ...rest
}) => {
  const ownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isActive) {
      // wait for the KBarContent to resize, _then_ scrollIntoView.
      // https://medium.com/@owencm/one-weird-trick-to-performant-touch-response-animations-with-react-9fe4a0838116
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() =>
          ownRef.current?.scrollIntoView({ block: "nearest" })
        )
      );
    }
  }, [isActive]);

  return (
    <div
      ref={ownRef}
      style={{
        background: isActive ? "#eee" : "#fff",
        padding: "8px",
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

function useMatches(term: string, actions: Action[]) {
  // TODO: we can throttle this if needed
  return React.useMemo(
    () =>
      term.trim() === ""
        ? actions
        : matchSorter(actions, term, { keys: ["keywords", "name"] }),
    [term, actions]
  );
}
