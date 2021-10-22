import * as React from "react";
import { Results, useResultItem } from "./Results";
import useMatches from "./useMatches";
import { useVirtual } from "react-virtual";
import { Action } from "./types";
import { useKBar } from ".";

export default function KBarVirtualizedResults() {
  const { query, search } = useKBar((state) => ({
    search: state.searchQuery,
  }));
  const matches = useMatches();
  const parentRef = React.useRef(null);
  const flattened = React.useMemo(
    () =>
      matches.reduce((acc, curr) => {
        const { actions, name } = curr;
        acc.push(name);
        acc.push(...actions);
        return acc;
      }, [] as (string | Action)[]),
    [matches]
  );

  const rowVirtualizer = useVirtual({
    size: flattened.length,
    parentRef,
  });

  const [activeIndex, setActiveIndex] = React.useState(1);

  const perform = React.useCallback(
    (index) => {
      const item = flattened[index];

      if (typeof item === "string") return;

      if (item.perform) {
        item.perform();
        query.toggle();
      } else {
        query.setCurrentRootAction(item.id);
      }
    },
    [flattened, query]
  );

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowDown") {
        setActiveIndex((index) =>
          index < flattened.length - 1 ? index + 1 : index
        );
      } else if (event.key === "ArrowUp") {
        setActiveIndex((index) => (index > 1 ? index - 1 : index));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flattened]);

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        perform(activeIndex);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, perform]);

  React.useEffect(() => {
    rowVirtualizer.scrollToIndex(activeIndex);
  }, [activeIndex]);

  React.useEffect(() => {
    setActiveIndex(1);
  }, [search]);

  const getItemHandlers = React.useCallback(
    (index) => ({
      onMouseEnter: () => setActiveIndex(index),
      onPointerDown: () => setActiveIndex(index),
      onClick: () => perform(index),
    }),
    [perform]
  );

  return (
    <div
      ref={parentRef}
      style={{
        maxHeight: 150,
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const item = flattened[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              ref={virtualRow.measureRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {typeof item === "string" ? (
                <RenderGroupName name={item} />
              ) : (
                <RenderActionItem
                  action={item}
                  active={activeIndex === virtualRow.index}
                  getItemHandlers={getItemHandlers(virtualRow.index)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RenderGroupName({ name }: { name: string }) {
  return (
    <div
      style={{
        padding: "8px 16px",
        fontSize: "10px",
        textTransform: "uppercase" as const,
        opacity: 0.5,
        background: "#fbfbfb",
      }}
    >
      {name}
    </div>
  );
}

function RenderActionItem({
  action,
  active,
  getItemHandlers,
}: {
  action: Action;
  active: boolean;
  getItemHandlers: any;
}) {
  return (
    <div
      {...getItemHandlers}
      style={{
        padding: "12px 16px",
        background: active ? "var(--a1)" : "var(--background)",
        borderLeft: `2px solid ${active ? "var(--foreground)" : "transparent"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {action.icon && action.icon}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{action.name}</span>
          {action.subtitle && (
            <span style={{ fontSize: 12 }}>{action.subtitle}</span>
          )}
        </div>
      </div>
      {action.shortcut?.length ? (
        <div style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}>
          {action.shortcut.map((sc) => (
            <kbd
              key={sc}
              style={{
                padding: "4px 6px",
                background: "rgba(0 0 0 / .1)",
                borderRadius: "4px",
              }}
            >
              {sc}
            </kbd>
          ))}
        </div>
      ) : null}
    </div>
  );
}
