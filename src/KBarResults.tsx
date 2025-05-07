import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ActionImpl } from "./action/ActionImpl";
import { getListboxItemId, KBAR_LISTBOX } from "./KBarSearch";
import { useKBar } from "./useKBar";
import { usePointerMovedSinceMount } from "./utils";

const START_INDEX = 0;
const SIZE_ESTIMATE = 50;  // arbitrary size estimate

interface RenderParams<T = ActionImpl | string> {
  item: T;
  active: boolean;
}

interface KBarResultsProps {
  items: any[];
  onRender: (params: RenderParams) => React.ReactElement;
  maxHeight?: number;
}

export const KBarResults: React.FC<KBarResultsProps> = (props) => {
  const activeRef = React.useRef<HTMLDivElement | null>(null);
  const parentRef = React.useRef(null);

  // store a ref to all items so we do not have to pass
  // them as a dependency when setting up event listeners.
  const itemsRef = React.useRef(props.items);
  itemsRef.current = props.items;

  const rowVirtualizer = useVirtualizer({
    count: itemsRef.current.length,
    estimateSize: () => SIZE_ESTIMATE,
    measureElement: (element) => element.clientHeight,
    getScrollElement: () => parentRef.current,
  });

  const { query, search, currentRootActionId, activeIndex, options } = useKBar(
    (state) => ({
      search: state.searchQuery,
      currentRootActionId: state.currentRootActionId,
      activeIndex: state.activeIndex,
    })
  );

  React.useEffect(() => {
    const handler = (event) => {
      if (event.isComposing) {
        return;
      }
      
      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        event.stopPropagation();
        query.setActiveIndex((index) => {
          let nextIndex = index > START_INDEX ? index - 1 : index;
          // avoid setting active index on a group
          if (typeof itemsRef.current[nextIndex] === "string") {
            if (nextIndex === 0) return index;
            nextIndex -= 1;
          }
          return nextIndex;
        });
      } else if (
        event.key === "ArrowDown" ||
        (event.ctrlKey && event.key === "n")
      ) {
        event.preventDefault();
        event.stopPropagation();
        query.setActiveIndex((index) => {
          let nextIndex =
            index < itemsRef.current.length - 1 ? index + 1 : index;
          // avoid setting active index on a group
          if (typeof itemsRef.current[nextIndex] === "string") {
            if (nextIndex === itemsRef.current.length - 1) return index;
            nextIndex += 1;
          }
          return nextIndex;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        // storing the active dom element in a ref prevents us from
        // having to calculate the current action to perform based
        // on the `activeIndex`, which we would have needed to add
        // as part of the dependencies array.
        activeRef.current?.click();
      }
    };
    window.addEventListener("keydown", handler, {capture: true});
    return () => window.removeEventListener("keydown", handler, {capture: true});
  }, [query]);

  // destructuring here to prevent linter warning to pass
  // entire rowVirtualizer in the dependencies array.
  const { scrollToIndex } = rowVirtualizer;
  React.useEffect(() => {
    if (itemsRef.current.length < 1) return;
    // ensure that if the first item in the list is a group
    // name and we are focused on the second item, to not
    // scroll past that group, hiding it.
    const targetIndex = activeIndex <= 1 ? 0 : activeIndex;
    // Defer scrolling until after animations start, otherwise it will
    // fail if the height animation starts from 0
    // The divisor of 16 was chosen based on experimentation.
    setTimeout(() => {
      scrollToIndex(targetIndex)
    }, (options.animations?.enterMs ?? 0) / 16)
  }, [activeIndex, scrollToIndex, options.animations?.enterMs]);

  React.useEffect(() => {
    // TODO(tim): fix scenario where async actions load in
    // and active index is reset to the first item. i.e. when
    // users register actions and bust the `useRegisterActions`
    // cache, we won't want to reset their active index as they
    // are navigating the list.
    query.setActiveIndex(
      // avoid setting active index on a group
      typeof props.items[START_INDEX] === "string"
        ? START_INDEX + 1
        : START_INDEX
    );
  }, [search, currentRootActionId, props.items, query]);

  const execute = React.useCallback(
    (item: RenderParams["item"]) => {
      if (typeof item === "string") return;
      if (item.command) {
        item.command.perform(item);
        query.toggle();
      } else {
        query.setSearch("");
        query.setCurrentRootAction(item.id);
      }
      options.callbacks?.onSelectAction?.(item);
    },
    [query, options]
  );

  const pointerMoved = usePointerMovedSinceMount();

  return (
    <div
      ref={parentRef}
      style={{
        maxHeight: props.maxHeight || 400,
        position: "relative",
        overflow: "auto",
      }}
    >
      <div
        role="listbox"
        id={KBAR_LISTBOX}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = itemsRef.current[virtualRow.index];
          const handlers = typeof item !== "string" && {
            onPointerMove: () =>
              pointerMoved &&
              activeIndex !== virtualRow.index &&
              query.setActiveIndex(virtualRow.index),
            onPointerDown: () => query.setActiveIndex(virtualRow.index),
            onClick: () => execute(item),
          };
          const active = virtualRow.index === activeIndex;

          return (
            <div
              ref={(elem) => {
                rowVirtualizer.measureElement(elem);
                if (active) activeRef.current = elem;
              }}
              data-index={virtualRow.index}
              id={getListboxItemId(virtualRow.index)}
              role="option"
              aria-selected={active}
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
              {...handlers}
            >
              {props.onRender({
                item,
                active,
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
