import * as React from "react";
import { ActionImpl } from "./action";
import tinykeys from "./tinykeys";
import { VisualState } from "./types";
import { useKBar } from "./useKBar";
import { getScrollbarWidth, shouldRejectKeystrokes } from "./utils";

type Timeout = ReturnType<typeof setTimeout>;

export function InternalEvents() {
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
  const { query, options, visualState, showing, disabled } = useKBar(
    (state) => ({
      visualState: state.visualState,
      showing: state.visualState !== VisualState.hidden,
      disabled: state.disabled,
    })
  );

  React.useEffect(() => {
    const close = () => {
      query.setVisualState((vs) => {
        if (vs === VisualState.hidden || vs === VisualState.animatingOut) {
          return vs;
        }
        return VisualState.animatingOut;
      });
    };

    if (disabled) {
      close();
      return;
    }

    const shortcut = options.toggleShortcut || "$mod+k";

    const unsubscribe = tinykeys(window, {
      [shortcut]: (event: KeyboardEvent) => {
        if (event.defaultPrevented) return;
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
          event.preventDefault();
          options.callbacks?.onClose?.();
        }

        close();
      },
    });
    return () => {
      unsubscribe();
    };
  }, [options.callbacks, options.toggleShortcut, query, showing, disabled]);

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
    if (options.disableDocumentLock) return;
    if (visualState === VisualState.animatingIn) {
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
      document.body.style.removeProperty("overflow");

      if (!options.disableScrollbarManagement) {
        document.body.style.removeProperty("margin-right");
      }
    }
  }, [
    options.disableDocumentLock,
    options.disableScrollbarManagement,
    visualState,
  ]);
}

/**
 * Reference: https://github.com/jamiebuilds/tinykeys/issues/37
 *
 * Fixes an issue where simultaneous key commands for shortcuts;
 * ie given two actions with shortcuts ['t','s'] and ['s'], pressing
 * 't' and 's' consecutively will cause both shortcuts to fire.
 *
 * `wrap` sets each keystroke event in a WeakSet, and ensures that
 * if ['t', 's'] are pressed, then the subsequent ['s'] event will
 * be ignored. This depends on the order in which we register the
 * shortcuts to tinykeys, which is handled below.
 */
const handled = new WeakSet();
function wrap(handler: (event: KeyboardEvent) => void) {
  return (event: KeyboardEvent) => {
    if (handled.has(event)) return;
    handler(event);
    handled.add(event);
  };
}

/**
 * `useShortcuts` registers and listens to keyboard strokes and
 * performs actions for patterns that match the user defined `shortcut`.
 */
function useShortcuts() {
  const { actions, query, open, options, disabled } = useKBar((state) => ({
    actions: state.actions,
    open: state.visualState === VisualState.showing,
    disabled: state.disabled,
  }));

  React.useEffect(() => {
    if (open || disabled) return;

    const actionsList = Object.keys(actions).map((key) => actions[key]);

    let actionsWithShortcuts: ActionImpl[] = [];
    for (let action of actionsList) {
      if (!action.shortcut?.length) {
        continue;
      }
      actionsWithShortcuts.push(action);
    }

    actionsWithShortcuts = actionsWithShortcuts.sort(
      (a, b) => b.shortcut!.join(" ").length - a.shortcut!.join(" ").length
    );

    const shortcutsMap = {};
    for (let action of actionsWithShortcuts) {
      const shortcut = action.shortcut!.join(" ");

      shortcutsMap[shortcut] = wrap((event: KeyboardEvent) => {
        if (shouldRejectKeystrokes()) return;

        event.preventDefault();
        if (action.children?.length) {
          query.setCurrentRootAction(action.id);
          query.toggle();
          options.callbacks?.onOpen?.();
        } else {
          action.command?.perform();
          options.callbacks?.onSelectAction?.(action);
        }
      });
    }

    const unsubscribe = tinykeys(window, shortcutsMap, {
      timeout: 400,
    });

    return () => {
      unsubscribe();
    };
  }, [actions, open, options.callbacks, query, disabled]);
}

/**
 * `useFocusHandler` ensures that focus is set back on the element which was
 * in focus prior to kbar being triggered.
 */
function useFocusHandler() {
  const rFirstRender = React.useRef(true);
  const { isShowing, query } = useKBar((state) => ({
    isShowing:
      state.visualState === VisualState.showing ||
      state.visualState === VisualState.animatingIn,
  }));

  const activeElementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (rFirstRender.current) {
      rFirstRender.current = false;
      return;
    }
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
    if (activeElement && activeElement !== currentActiveElement) {
      activeElement.focus();
    }
  }, [isShowing]);

  // When focus is blurred from the search input while kbar is still
  // open, any keystroke should set focus back to the search input.
  React.useEffect(() => {
    function handler(event: KeyboardEvent) {
      const input = query.getInput();
      if (event.target !== input) {
        input.focus();
      }
    }
    if (isShowing) {
      window.addEventListener("keydown", handler);
      return () => {
        window.removeEventListener("keydown", handler);
      };
    }
  }, [isShowing, query]);
}
