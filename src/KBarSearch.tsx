import * as React from "react";
import { VisualState } from "./types";
import { useKBar } from "./useKBar";

export const KBAR_LISTBOX = "kbar-listbox";
export const getListboxItemId = (id: number) => `kbar-listbox-item-${id}`;

export function KBarSearch(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    defaultPlaceholder?: string;
  }
) {
  const {
    query,
    search,
    actions,
    currentRootActionId,
    activeIndex,
    showing,
    options,
  } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
    actions: state.actions,
    activeIndex: state.activeIndex,
    showing: state.visualState === VisualState.showing,
  }));

  const [inputValue, setInputValue] = React.useState(search);
  React.useEffect(() => {
    query.setSearch(inputValue);
   }, [inputValue, query]);

  const { defaultPlaceholder, ...rest } = props;

  React.useEffect(() => {
    query.setSearch("");
    query.getInput().focus();
    return () => query.setSearch("");
  }, [currentRootActionId, query]);

  const placeholder = React.useMemo((): string => {
    const defaultText = defaultPlaceholder ?? "Type a command or search…";
    return currentRootActionId && actions[currentRootActionId]
      ? actions[currentRootActionId].name
      : defaultText;
  }, [actions, currentRootActionId, defaultPlaceholder]);

  return (
    <input
      {...rest}
      ref={query.inputRefSetter}
      autoFocus
      autoComplete="off"
      role="combobox"
      spellCheck="false"
      aria-expanded={showing}
      aria-controls={KBAR_LISTBOX}
      aria-activedescendant={getListboxItemId(activeIndex)}
      value={inputValue}
      placeholder={placeholder}
      onChange={(event) => {
        props.onChange?.(event);
        setInputValue(event.target.value);
        options?.callbacks?.onQueryChange?.(event.target.value);
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (currentRootActionId && !search && event.key === "Backspace") {
          const parent = actions[currentRootActionId].parent;
          query.setCurrentRootAction(parent);
        }
      }}
    />
  );
}
