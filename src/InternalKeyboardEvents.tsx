import * as React from "react";
import { VisualState } from "./types";
import useKBar from "./useKBar";

type Timeout = ReturnType<typeof setTimeout>;

export default function InternalKeyboardEvents() {
  const { query, options, visualState, actions } = useKBar((state) => ({
    visualState: state.visualState,
    actions: state.actions,
  }));

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
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

  // Shortcuts
  React.useEffect(() => {
    const actionsList = Object.keys(actions).map((key) => actions[key]);

    const charList = "abcdefghijklmnopqrstuvwxyz0123456789";
    const inputs = ["input", "select", "button", "textarea"];

    let buffer: string[] = [];
    let lastKeyStrokeTime = Date.now();

    function handleKeyDown(event) {
      const key = event.key.toLowerCase();

      const activeElement = document.activeElement;
      const ignoreStrokes =
        activeElement &&
        inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1;

      if (ignoreStrokes || event.metaKey || charList.indexOf(key) === -1) {
        return;
      }

      const currentTime = Date.now();

      if (currentTime - lastKeyStrokeTime > 1000) {
        buffer = [];
      }

      buffer.push(key);
      lastKeyStrokeTime = currentTime;

      for (let action of actionsList) {
        if (JSON.stringify(action.shortcut) === JSON.stringify(buffer)) {
          action.perform?.();
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        query.setSearch("");
      }, ms);
    },
    []
  );

  React.useEffect(() => {
    switch (visualState) {
      case VisualState.animatingIn:
      case VisualState.animatingOut:
        runAnimateTimer(visualState);
        break;
    }
  }, [visualState]);

  return null;
}
