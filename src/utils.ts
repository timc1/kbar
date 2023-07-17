import * as React from "react";
import type { Action } from "./types";

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
    function handler(event) {
      if (
        dom.current?.contains(event.target) ||
        // Add support for ReactShadowRoot
        // @ts-expect-error wrong types, the `host` property exists https://stackoverflow.com/a/25340456
        event.target === dom.current?.getRootNode().host
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      cbRef.current();
    }
    window.addEventListener("pointerdown", handler, true);
    return () => window.removeEventListener("pointerdown", handler, true);
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

export function createAction(params: Omit<Action, "id">) {
  return {
    id: randomId(),
    ...params,
  } as Action;
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

export function useThrottledValue<T = any>(value: T, ms: number = 100) {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    if (ms === 0) return;

    const timeout = setTimeout(() => {
      setThrottledValue(value);
      lastRan.current = Date.now();
    }, lastRan.current - (Date.now() - ms));

    return () => {
      clearTimeout(timeout);
    };
  }, [ms, value]);

  return ms === 0 ? value : throttledValue;
}

export function shouldRejectKeystrokes(
  {
    ignoreWhenFocused,
  }: {
    ignoreWhenFocused: string[];
  } = { ignoreWhenFocused: [] }
) {
  const inputs = ["input", "textarea", ...ignoreWhenFocused].map((el) =>
    el.toLowerCase()
  );

  const activeElement = document.activeElement;

  const ignoreStrokes =
    activeElement &&
    (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 ||
      activeElement.attributes.getNamedItem("role")?.value === "textbox" ||
      activeElement.attributes.getNamedItem("contenteditable")?.value ===
        "true" ||
      activeElement.attributes.getNamedItem("contenteditable")?.value ===
        "plaintext-only");

  return ignoreStrokes;
}

const SSR = typeof window === "undefined";
const isMac = !SSR && window.navigator.platform === "MacIntel";

export function isModKey(
  event: KeyboardEvent | MouseEvent | React.KeyboardEvent
) {
  return isMac ? event.metaKey : event.ctrlKey;
}

export const Priority = {
  HIGH: 1,
  NORMAL: 0,
  LOW: -1,
};
