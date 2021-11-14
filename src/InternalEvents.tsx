import * as React from "react";
import tinykeys from "tinykeys";
import { VisualState } from "./types";
import useKBar from "./useKBar";
import { getScrollbarWidth } from "./utils";

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
  const { query, options, visualState, showing } = useKBar((state) => ({
    visualState: state.visualState,
    showing: state.visualState !== VisualState.hidden,
  }));

  React.useEffect(() => {
    const unsubscribe = tinykeys(window, {
      "$mod+k": (event: KeyboardEvent) => {
        event.preventDefault();
        query.toggle();

        if (showing) {
          options.callbacks?.onClose?.();
        } else {
          options.callbacks?.onOpen?.();
        }
      },
      Escape: (event: KeyboardEvent) => {
        if (showing) {
          event.stopPropagation();
          options.callbacks?.onClose?.();
        }

        query.setVisualState((vs) => {
          if (vs === VisualState.hidden || vs === VisualState.animatingOut) {
            return vs;
          }
          return VisualState.animatingOut;
        });
      },
    });
    return () => {
      unsubscribe();
    };
  }, [options.callbacks, query, showing]);

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
        let backToRoot = false;

        // TODO: setVisualState argument should be a function or just a VisualState value.
        query.setVisualState(() => {
          const finalVs =
            vs === VisualState.animatingIn
              ? VisualState.showing
              : VisualState.hidden;

          if (finalVs === VisualState.hidden) {
            backToRoot = true;
          }

          return finalVs;
        });

        if (backToRoot) {
          query.setCurrentRootAction(null);
        }
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
  const { visualState, options } = useKBar((state) => ({
    visualState: state.visualState,
  }));

  React.useEffect(() => {
    if (visualState === VisualState.animatingIn) {
      document.body.style.pointerEvents = "none";
      document.body.style.overflow = "hidden";

      if (!options.disableScrollbarManagement) {
        let scrollbarWidth = getScrollbarWidth();
        // take into account the margins explicitly added by the consumer
        const mr = getComputedStyle(document.body)["margin-right"];
        if (mr) {
          // remove non-numeric values; px, rem, em, etc.
          scrollbarWidth += Number(mr.replace(/\D/g, ""));
        }
        document.body.style.marginRight = scrollbarWidth + "px";
      }
    } else if (visualState === VisualState.hidden) {
      document.body.style.removeProperty("pointer-events");
      document.body.style.removeProperty("overflow");

      if (!options.disableScrollbarManagement) {
        document.body.style.removeProperty("margin-right");
      }
    }
  }, [options.disableScrollbarManagement, visualState]);
}

/**
 * `useShortcuts` registers and listens to keyboard strokes and
 * performs actions for patterns that match the user defined `shortcut`.
 */
function useShortcuts() {
  const { actions, query } = useKBar((state) => ({
    actions: state.actions,
  }));

  React.useEffect(() => {
    const actionsList = Object.keys(actions).map((key) => actions[key]);

    const inputs = ["input", "select", "button", "textarea"];

    const keyBindingMap = {};
    for (let action of actionsList) {
      if (!action.shortcut) {
        continue;
      }

      const keybinding = Array.isArray(action.shortcut)
        ? action.shortcut.join(" ")
        : action.shortcut;

      keyBindingMap[keybinding] = (event: KeyboardEvent) => {
        const activeElement = document.activeElement;
        const ignoreStrokes =
          activeElement &&
          (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 ||
            activeElement.attributes.getNamedItem("role")?.value ===
              "textbox" ||
            activeElement.attributes.getNamedItem("contenteditable")?.value ===
              "true");

        if (ignoreStrokes) {
          return;
        }

        event.preventDefault();
        if (action.children?.length) {
          query.setCurrentRootAction(action.id);
          query.toggle();
        } else {
          action.perform?.();
        }
      };
    }

    const unsubscribe = tinykeys(window, keyBindingMap, {
      timeout: 400,
    });

    return () => {
      unsubscribe();
    };
  }, [actions, query]);
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
