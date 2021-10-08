import * as React from "react";
import { VisualState } from ".";
import { Action, ActionGroup, KBarGroupedResultsProps } from "./types";
import useKBar from "./useKBar";
import useMatches from "./useMatches";

export const NO_GROUP = "none";

export default function KBarGroupedResults(props: KBarGroupedResultsProps) {
  const groupsWithCount = useMatches();
  const { onRender, ...rest } = props;
  return (
    <div {...rest}>
      {typeof onRender === "function" ? (
        onRender(groupsWithCount)
      ) : (
        <RenderGroups
          groups={groupsWithCount.actionGroups}
          total={groupsWithCount.total}
        />
      )}
    </div>
  );
}

const defaultGroupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
  background: "transparent",
};

const getDefaultResultStyle = (active: boolean) => ({
  padding: "8px 16px",
  background: active ? "#80808047" : "transparent",
});

function RenderGroups({
  groups,
  total,
}: {
  groups: ActionGroup[];
  total: number;
}) {
  const { search, query, rootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    rootActionId: state.currentRootActionId,
  }));

  const [activeIndex, setActiveIndex] = React.useState(0);

  // Keyboard navigation
  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        event.preventDefault();
        setActiveIndex((curr) => (curr < total - 1 ? curr + 1 : 0));
      } else if (
        event.key === "ArrowUp" ||
        (event.ctrlKey && event.key === "p")
      ) {
        event.preventDefault();
        setActiveIndex((curr) => (curr > 0 ? curr - 1 : total - 1));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [groups, total]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll management
  React.useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  const perform = React.useCallback(() => {
    const list = groups.reduce((acc, curr) => {
      const actions = curr.actions;
      acc.push(...actions);
      return acc;
    }, [] as Action[]);

    const action = list[activeIndex];
    if (!action) return;

    if (action.perform) {
      action.perform();
      query.setVisualState(VisualState.animatingOut);
      return;
    }

    if (action.children) {
      query.setCurrentRootAction(action.id);
      return;
    }
  }, [activeIndex, groups, query]);

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        perform();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [perform]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [search, rootActionId]);

  let index = 0;

  return (
    <div>
      {groups.map((group) => (
        <div key={group.name}>
          {group.name !== NO_GROUP && (
            <div style={defaultGroupNameStyle}>{group.name}</div>
          )}
          {group.actions.map((action) => {
            const currIndex = index;
            const active = activeIndex === currIndex;
            index++;

            const handlers = {
              onPointerDown: () => setActiveIndex(currIndex),
              onMouseEnter: () => setActiveIndex(currIndex),
              onClick: perform,
            };

            return (
              <div
                ref={active ? scrollRef : null}
                key={action.id}
                style={getDefaultResultStyle(active)}
                {...handlers}
              >
                {action.name}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
