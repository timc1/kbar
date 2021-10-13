import * as React from "react";
import { useKBar } from "..";
import { Action } from "../types";
import { randomId, useIsomorphicLayout } from "../utils";
import { ResultsContext } from "./Results";

interface useResultItemProps {
  action: Action;
}

export function useResultItem(props: useResultItemProps) {
  const context = React.useContext(ResultsContext);
  const id = React.useRef(randomId());
  if (!id.current) {
    id.current = randomId();
  }
  const [index, setIndex] = React.useState(-1);

  useIsomorphicLayout(() => {
    const newIndex = context.getIndex(id.current);
    if (newIndex !== index) {
      setIndex(newIndex);
    }
  });

  const { query } = useKBar();

  return {
    index,
    active: index === context.activeIndex,
    handlers: context.getHandlers(index, () => {
      if (props.action.children) {
        query.setSearch("");
        query.setCurrentRootAction(props.action.id);
        return;
      }
      props.action?.perform?.();
      query.toggle();
    }),
  };
}
