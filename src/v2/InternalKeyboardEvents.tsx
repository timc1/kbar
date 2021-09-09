import React from "react";
import { VisualState } from "./types";
import useKBar from "./useKBar";

type Timeout = ReturnType<typeof setTimeout>;

export default function InternalKeyboardEvents() {
  const { query, options, visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }));

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        query.setVisualState((vs) => {
          if (vs === VisualState.hidden || vs === VisualState.animatingOut) {
            return VisualState.animatingIn;
          }
          return VisualState.animatingOut;
        });
      }
      if (event.key === "Escape") {
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
      case VisualState.hidden:
        console.log("set root actions");
        break;
    }
  }, [visualState]);

  return null;
}
