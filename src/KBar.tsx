import Portal from "@reach/portal";
import * as React from "react";

const DEFAULT_ANIMATION_MS = 100;

export interface ActionContext {}

type Timeout = ReturnType<typeof setTimeout>;

export interface Action {
  id: string;
  name: string;
  shortcut: string[];
  keywords: string;
  perform: (context: ActionContext) => void;
  group?: string;
}

export interface Options {
  animationMs?: number;
}

export interface KBarProps {
  router: any;
  actions: Record<string, Action>;
  options: Options;
}

enum VisualState {
  animatingIn = "animating-in",
  showing = "showing",
  animatingOut = "animatingOut",
  hidden = "hidden",
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

const animationKeyframes = [
  {
    opacity: 0,
    transform: "scale(0.9)",
  },
  { opacity: 0.75, transform: "scale(1.1)" },
  { opacity: 1, transform: "scale(1)" },
];

const contentStyle: React.CSSProperties = {
  maxWidth: "640px",
  width: "min-content",
  ...animationKeyframes[0],
};

export const KBar: React.FC<KBarProps> = (props) => {
  const animationMs = props.options?.animationMs || DEFAULT_ANIMATION_MS;

  const [visualState, setVisualState] = React.useState<VisualState>(
    VisualState.hidden
  );

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
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const timeoutRef = React.useRef<Timeout>();
  const animate = React.useCallback(
    (
      type: VisualState.animatingIn | VisualState.animatingOut,
      onSuccess: () => void
    ) => {
      clearTimeout(timeoutRef.current as Timeout);
      timeoutRef.current = setTimeout(() => {
        const finalType =
          type === VisualState.animatingIn
            ? VisualState.showing
            : VisualState.hidden;
        setVisualState(finalType);
        onSuccess();
      }, animationMs);
    },
    []
  );

  React.useEffect(() => {
    switch (visualState) {
      case VisualState.animatingIn:
        animate(VisualState.animatingIn, () => {
          console.log("hello");
        });
        break;
      case VisualState.animatingOut:
        animate(VisualState.animatingOut, () => {
          console.log("goodbye");
        });
        break;
    }
  }, [visualState]);

  if (visualState === VisualState.hidden) {
    return null;
  }

  return (
    <Portal>
      <div style={outerWrapperStyle}>
        <KBarContent visualState={visualState} animationMs={animationMs}>
          hiiii
        </KBarContent>
      </div>
    </Portal>
  );
};

export interface KBarContentProps {
  visualState: Omit<VisualState, "hidden">;
  animationMs: number;
}

const KBarContent: React.FC<KBarContentProps> = (props) => {
  const ownRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    // No need to force an animation when showing
    if (props.visualState === VisualState.showing) {
      return;
    }

    const element = ownRef.current;

    element?.animate(animationKeyframes, {
      duration: props.animationMs,
      easing: "ease-out",
      direction:
        props.visualState === VisualState.animatingOut ? "reverse" : "normal",
      fill: "forwards",
    });
  }, [props.visualState, props.animationMs]);

  return (
    <div ref={ownRef} style={contentStyle}>
      {props.children}
    </div>
  );
};
