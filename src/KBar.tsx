import Portal from "@reach/portal";
import * as React from "react";
import KbarAnimator from "./KBarAnimator";
import KBarSearch from "./KBarSearch";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { Action, VisualState } from "./types";

const DEFAULT_ANIMATION_MS = 200;

type Timeout = ReturnType<typeof setTimeout>;

export interface KBarProps {
  actions: Record<string, Action>;
  options?: Options;
}

export interface Options {
  animationMs?: number;
}

const outerWrapperStyle: React.CSSProperties = {
  position: "fixed",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  inset: "0px",
  padding: "calc(13vh - 0.48px) 16px 16px",
};

let listener: ((state: VisualState) => void) | null = null;

let memoryState: VisualState = VisualState.hidden;

export function toggle() {
  let state = memoryState;

  if (state === VisualState.showing) {
    state = VisualState.animatingOut;
  } else {
    state = VisualState.animatingIn;
  }

  memoryState = state;

  listener?.(memoryState);
}

export const KBar: React.FC<KBarProps> = (props) => {
  const animationMs = props.options?.animationMs || DEFAULT_ANIMATION_MS;

  const [visualState, setVisualState] =
    React.useState<VisualState>(memoryState);

  const rootActions = React.useMemo(() => {
    return Object.keys(props.actions).reduce((acc, curr) => {
      const action = props.actions[curr];
      if (action.parent === "root") {
        acc[action.id] = action;
      }
      return acc;
    }, {});
  }, []);

  const [actions, setActions] =
    React.useState<Record<string, Action>>(rootActions);

  React.useEffect(() => {
    listener = setVisualState;
    return () => {
      listener = null;
    };
  }, [visualState]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === "k") {
        setVisualState((vs) => {
          if (vs === VisualState.hidden || vs === VisualState.animatingOut) {
            return VisualState.animatingIn;
          }
          return VisualState.animatingOut;
        });
      }

      if (event.key === "Escape") {
        setVisualState((vs) =>
          vs === VisualState.hidden ? vs : VisualState.animatingOut
        );
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const timeoutRef = React.useRef<Timeout>();
  const animate = React.useCallback(
    (
      type: VisualState.animatingIn | VisualState.animatingOut,
      onSuccess?: () => void
    ) => {
      clearTimeout(timeoutRef.current as Timeout);
      timeoutRef.current = setTimeout(() => {
        const finalType =
          type === VisualState.animatingIn
            ? VisualState.showing
            : VisualState.hidden;
        setVisualState(finalType);
        onSuccess?.();
      }, animationMs);
    },
    []
  );

  React.useEffect(() => {
    switch (visualState) {
      case VisualState.animatingIn:
        animate(VisualState.animatingIn);
        break;
      case VisualState.animatingOut:
        animate(VisualState.animatingOut);
        break;
      case VisualState.hidden:
        setActions(rootActions);
        break;
    }
    // no need to set props.actions as a dep as it's never going to change
  }, [visualState]);

  const close = React.useCallback(
    () => setVisualState(VisualState.animatingOut),
    []
  );

  return (
    <>
      <KeyboardShortcuts actions={props.actions} />
      {visualState === VisualState.hidden ? null : (
        <Portal>
          <div
            style={outerWrapperStyle}
            onClick={close}
            // @ts-ignore
            disabled={[VisualState.animatingOut || VisualState.hidden].includes(
              visualState
            )}
          >
            <KbarAnimator visualState={visualState} animationMs={animationMs}>
              <KBarSearch
                actions={actions}
                onRequestClose={close}
                onUpdateRootAction={(actionId) => {
                  const newRoot = props.actions[actionId];
                  const newActions = newRoot.children?.reduce((acc, curr) => {
                    const action = props.actions[curr];
                    acc[action.id] = action;
                    return acc;
                  }, {}) as Record<string, Action>;

                  console.log({ newActions });

                  setActions(newActions);
                }}
              />
            </KbarAnimator>
          </div>
        </Portal>
      )}
    </>
  );
};
