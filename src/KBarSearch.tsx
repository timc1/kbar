import * as React from "react";
import useKBar from "./useKBar";

export default function KBarSearch(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const { query, search, actions, currentRootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
    actions: state.actions,
  }));

  const ownRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    query.setSearch("");
    ownRef.current!.focus();
    return () => query.setSearch("");
  }, [currentRootActionId, query]);

  const placeholder = React.useMemo(
    () =>
      currentRootActionId
        ? actions[currentRootActionId].name
        : "Type a command or search…",
    [actions, currentRootActionId]
  );

  return (
    <input
      ref={ownRef}
      autoFocus
      {...props}
      placeholder={placeholder}
      value={search}
      onChange={(event) => {
        props.onChange?.(event);
        query.setSearch(event.target.value);
      }}
      spellCheck="false"
      autoComplete="off"
      onKeyDown={(event) => {
        if (currentRootActionId && !search && event.key === "Backspace") {
          const parent = actions[currentRootActionId].parent;
          query.setCurrentRootAction(parent?.id);
        }
      }}
    />
  );
}
