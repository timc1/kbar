import * as React from "react";
import { BaseAction } from "./types";

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

export function createAction(params: Omit<BaseAction, "id">) {
  return {
    id: randomId(),
    ...params,
  } as BaseAction;
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

export function useThrottledValue(value: any, ms: number = 100) {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setThrottledValue(value);
      lastRan.current = Date.now();
    }, lastRan.current - (Date.now() - ms));

    return () => {
      clearTimeout(timeout);
    };
  }, [ms, value]);

  return throttledValue;
}
