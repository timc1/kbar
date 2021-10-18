import * as React from "react";
import { VisualState } from "./types";
import useKBar from "./useKBar";

type Timeout = ReturnType<typeof setTimeout>;

export default function InternalEvents() {
  useToggleHandler();
  useDocumentLock();
  useShortcuts();
  useFocusHandler();
  return null;
}

/**
 * `useToggleHandler` handles the keyboard events for toggling kbar.
 */
function useToggleHandler() {
  const { query, options, visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }));

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "k" &&
        event.defaultPrevented === false
      ) {
        event.preventDefault();
        query.setVisualState((vs) => {
          if (vs === VisualState.hidden || vs === VisualState.animatingOut) {
            return VisualState.animatingIn;
          }
          return VisualState.animatingOut;
        });
      }
      if (event.key === "Escape") {
        event.preventDefault();
        query.setVisualState((vs) => {
          if (vs === VisualState.hidden || vs === VisualState.animatingOut) {
            return vs;
          }
          return VisualState.animatingOut;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  const timeoutRef = React.useRef<Timeout>();
  const runAnimateTimer = React.useCallback(
    (vs: VisualState.animatingIn | VisualState.animatingOut) => {
      let ms = 0;
      if (vs === VisualState.animatingIn) {
        ms = options.animations?.enterMs || 0;
      }
      if (vs === VisualState.animatingOut) {
        ms = options.animations?.exitMs || 0;
      }

      clearTimeout(timeoutRef.current as Timeout);
      timeoutRef.current = setTimeout(() => {
        // TODO: setVisualState argument should be a function or just a VisualState value.
        query.setVisualState(() => {
          const finalVs =
            vs === VisualState.animatingIn
              ? VisualState.showing
              : VisualState.hidden;
          return finalVs;
        });
        query.setCurrentRootAction(null);
      }, ms);
    },
    [options.animations?.enterMs, options.animations?.exitMs, query]
  );

  React.useEffect(() => {
    switch (visualState) {
      case VisualState.animatingIn:
      case VisualState.animatingOut:
        runAnimateTimer(visualState);
        break;
    }
  }, [runAnimateTimer, visualState]);
}

/**
 * `useDocumentLock` is a simple implementation for preventing the
 * underlying page content from scrolling when kbar is open.
 */
function useDocumentLock() {
  const { visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }));

  React.useEffect(() => {
    if (visualState === VisualState.showing) {
      document.documentElement.style.overflow = "hidden";
    } else if (visualState === VisualState.hidden) {
      document.documentElement.style.removeProperty("overflow");
    }
  }, [visualState]);
}

/**
 * `useShortcuts` registers and listens to keyboard strokes and
 * performs actions for patterns that match the user defined `shortcut`.
 */
function useShortcuts() {
  const { actions } = useKBar((state) => ({
    actions: state.actions,
  }));

  React.useEffect(() => {
    const actionsList = Object.keys(actions).map((key) => actions[key]);

    const charList = "abcdefghijklmnopqrstuvwxyz0123456789";
    const inputs = ["input", "select", "button", "textarea"];

    let buffer: string[] = [];
    let lastKeyStrokeTime = Date.now();

    function handleKeyDown(event) {
      const key = event.key?.toLowerCase();

      const activeElement = document.activeElement;
      const ignoreStrokes =
        activeElement &&
        inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1;

      if (ignoreStrokes || event.metaKey || charList.indexOf(key) === -1) {
        return;
      }

      const currentTime = Date.now();

      if (currentTime - lastKeyStrokeTime > 400) {
        buffer = [];
      }

      buffer.push(key);
      lastKeyStrokeTime = currentTime;
      const bufferString = buffer.join("");

      for (let action of actionsList) {
        if (!action.shortcut) {
          continue;
        }
        if (action.shortcut.join("") === bufferString) {
          action.perform?.();
          buffer = [];
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);
}

/**
 * `useFocusHandler` ensures that focus is set back on the element which was
 * in focus prior to kbar being triggered.
 */
function useFocusHandler() {
  const { isShowing } = useKBar((state) => ({
    isShowing:
      state.visualState === VisualState.showing ||
      state.visualState === VisualState.animatingIn,
  }));

  const activeElementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (isShowing) {
      activeElementRef.current = document.activeElement as HTMLElement;
      return;
    }

    // This fixes an issue on Safari where closing kbar causes the entire
    // page to scroll to the bottom. The reason this was happening was due
    // to the search input still in focus when we removed it from the dom.
    const currentActiveElement = document.activeElement as HTMLElement;
    if (currentActiveElement?.tagName.toLowerCase() === "input") {
      currentActiveElement.blur();
    }

    const activeElement = activeElementRef.current;
    if (activeElement) {
      activeElement.focus();
    }
  }, [isShowing]);
}
