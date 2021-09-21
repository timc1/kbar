import * as React from "react";
import { Action } from "./types";

export function swallowEvent(event) {
  event.stopPropagation();
  event.preventDefault();
}

export function useOuterClick(
  dom: React.RefObject<HTMLElement>,
  cb: () => void
) {
  const cbRef = React.useRef(cb);
  cbRef.current = cb;

  React.useEffect(() => {
    function handleMouseDown(event) {
      if (dom.current?.contains(event.target)) {
        return;
      }
      cbRef.current();
    }
    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [dom]);
}

export function randomId() {
  return Math.random().toString(36).substring(2, 9);
}

export function createAction(params: Omit<Action, "id">): Action {
  return {
    id: randomId(),
    ...params,
  };
}
