import * as React from "react";
import { VisualState } from "./types";

const animationKeyframes = [
  {
    opacity: 0,
    transform: "scale(0.95)",
  },
  { opacity: 0.75, transform: "scale(1.05)" },
  { opacity: 1, transform: "scale(1)" },
];

export interface KBarAnimatorProps {
  visualState: Omit<VisualState, "hidden">;
  animationMs: number;
}

const contentStyle: React.CSSProperties = {
  maxWidth: "640px",
  width: "min-content",
  ...animationKeyframes[0],
};

const KbarAnimator: React.FC<KBarAnimatorProps> = (props) => {
  const ownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // No need to force an animation when showing
    if (props.visualState === VisualState.showing) {
      return;
    }

    const element = ownRef.current;

    element?.animate(animationKeyframes, {
      duration: props.animationMs,
      easing:
        props.visualState === VisualState.animatingOut ? "ease-in" : "ease-out",
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

export default KbarAnimator;
