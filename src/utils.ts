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

export function usePointerMovedSinceMount() {
  const [moved, setMoved] = React.useState(false);

  React.useEffect(() => {
    function handler() {
      setMoved(true);
    }

    if (!moved) {
      window.addEventListener("pointermove", handler);
      return () => window.removeEventListener("pointermove", handler);
    }
  }, [moved]);

  return moved;
}

export function randomId() {
  return Math.random().toString(36).substring(2, 9);
}

export function createAction(params: Omit<Action, "id" | "children">): Action {
  return {
    id: randomId(),
    ...params,
  };
}

export function noop() {}

export const useIsomorphicLayout =
  typeof window === "undefined" ? noop : React.useLayoutEffect;

// https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
export function getScrollbarWidth() {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  document.body.appendChild(outer);
  const inner = document.createElement("div");
  outer.appendChild(inner);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode!.removeChild(outer);
  return scrollbarWidth;
}
