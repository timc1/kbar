import React from "react";
import useKBar from "./useKBar";

export default function KBarSearch(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const { query, search, actions, currentRootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
  }));

  return (
    <input
      autoFocus
      {...props}
      value={search}
      onChange={(event) => {
        props.onChange?.(event);
        query.setSearch(event.target.value);
      }}
      onKeyDown={(event) => {
        if (currentRootActionId && !search && event.key === "Backspace") {
          const parent = actions[currentRootActionId].parent;
          query.setCurrentRootAction(parent);
        }
      }}
    />
  );
}
