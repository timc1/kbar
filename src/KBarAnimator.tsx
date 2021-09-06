import * as React from "react";
import { VisualState } from "./types";

const animationKeyframes = [
  {
    opacity: 0,
    transform: "scale(0.95)",
  },
  { opacity: 0.75, transform: "scale(1.02)" },
  { opacity: 1, transform: "scale(1)" },
];

export interface KBarAnimatorProps {
  visualState: Omit<VisualState, "hidden">;
  animationMs: number;
  maxHeight?: number;
}

const contentStyle: React.CSSProperties = {
  maxWidth: "640px",
  width: "min-content",
  boxShadow: "0px 6px 20px rgb(0 0 0 / 20%)",
  ...animationKeyframes[0],
};

const KbarAnimator: React.FC<KBarAnimatorProps> = (props) => {
  const ownRef = React.useRef<HTMLDivElement>(null);
  const resizeRef = React.useRef<HTMLDivElement>(null);
  const maxHeight = props.maxHeight || 400;

  // Show/hide animation
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

  // Content height animation
  const previousHeight = React.useRef<number>();

  React.useEffect(() => {
    if (props.visualState === VisualState.showing) {
      const wrapper = ownRef.current;
      const resizeEl = resizeRef.current;

      if (!wrapper || !resizeEl) {
        return;
      }

      const ro = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const cr = entry.contentRect;

          if (!previousHeight.current) {
            previousHeight.current = cr.height;
          }

          wrapper.animate(
            [
              {
                height: `${previousHeight.current}px`,
              },
              { height: `${cr.height > maxHeight ? maxHeight : cr.height}px` },
            ],
            {
              duration: props.animationMs / 2,
              easing: "ease-out",
              fill: "forwards",
            }
          );
          previousHeight.current = cr.height;
        }
      });

      ro.observe(resizeEl);
      return () => {
        ro.unobserve(resizeEl);
      };
    }
  }, [props.visualState, props.animationMs]);

  return (
    <div ref={ownRef} style={contentStyle}>
      <div ref={resizeRef}>{props.children}</div>
    </div>
  );
};

export default KbarAnimator;
