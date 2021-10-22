import * as React from "react";
import { useVirtual } from "react-virtual";
import { useKBar } from "..";
import { Action } from "../types";

const START_INDEX = 0;

interface RenderItemHandlers {
  onPointerDown: () => void;
  onMouseEnter: () => void;
  onClick: () => void;
}

interface RenderParams<T = Action | string> {
  item: T;
  handlers: RenderItemHandlers;
  active: boolean;
}

interface VirtualResultsProps {
  items: any[];
  onRender: (params: RenderParams) => any;
}

export const VirtualResults: React.FC<VirtualResultsProps> = (props) => {
  const activeRef = React.useRef<HTMLElement>(null);
  const parentRef = React.useRef(null);

  // store a ref to the total number of items so we do not have to
  // pass this as a dependency when setting up event listeners.
  const total = React.useRef(props.items.length);
  total.current = props.items.length;
  const itemsRef = React.useRef(props.items);
  itemsRef.current = props.items;

  const rowVirtualizer = useVirtual({
    size: total.current,
    parentRef,
  });

  const [activeIndex, setActiveIndex] = React.useState(START_INDEX);

  const { query, search, currentRootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
  }));

  React.useEffect(() => {
    const handler = (event) => {
      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        setActiveIndex((index) => {
          let nextIndex = index > START_INDEX ? index - 1 : index;
          // avoid setting active index on a group
          if (typeof itemsRef.current[nextIndex] === "string") {
            nextIndex -= 1;
          }
          return nextIndex;
        });
      } else if (
        event.key === "ArrowDown" ||
        (event.ctrlKey && event.key === "n")
      ) {
        event.preventDefault();
        setActiveIndex((index) => {
          let nextIndex = index < total.current - 1 ? index + 1 : index;
          // avoid setting active index on a group
          if (typeof itemsRef.current[nextIndex] === "string") {
            nextIndex += 1;
          }
          return nextIndex;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        // storing the active dom element in a ref prevents us from
        // having to calculate the current action to perform based
        // on the `activeIndex`, which we would have needed to add
        // as part of the dependencies array.
        activeRef.current?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // destructuring here to prevent linter warning to pass
  // entire rowVirtualizer in the dependencies array.
  const { scrollToIndex } = rowVirtualizer;
  React.useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  React.useEffect(() => {
    // instead of using props.items, we will use items stored
    // in a ref in order to avoid running this effect as async
    // actions load in; i.e. when users register actions and
    // bust the `useRegisterActions` cache, we won't want to
    // reset their active index as they are navigating the list.
    setTimeout(
      () =>
        setActiveIndex(
          // avoid setting active index on a group
          typeof itemsRef.current[START_INDEX] === "string"
            ? START_INDEX + 1
            : START_INDEX
        ),
      0
    );
  }, [search, currentRootActionId]);

  const execute = React.useCallback(
    (item: RenderParams["item"]) => {
      if (typeof item === "string") return;
      if (item.perform) {
        item.perform();
        query.toggle();
        return;
      }
      query.setSearch("");
      query.setCurrentRootAction(item.id);
    },
    [query]
  );

  return (
    <div
      ref={parentRef}
      style={{
        maxHeight: 400,
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
          const item = itemsRef.current[virtualRow.index];
          const handlers: RenderItemHandlers = {
            onMouseEnter: () => setActiveIndex(virtualRow.index),
            onPointerDown: () => setActiveIndex(virtualRow.index),
            onClick: () => execute(item),
          };
          const active = virtualRow.index === activeIndex;

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {React.cloneElement(
                props.onRender({
                  item,
                  handlers,
                  active,
                }),
                {
                  ref: mergeRefs(virtualRow.measureRef, active && activeRef),
                }
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function mergeRefs(...refs: any[]) {
  return (value: any) =>
    refs
      .filter(Boolean)
      .forEach((ref) =>
        typeof ref === "function" ? ref(value) : (ref.current = value)
      );
}
