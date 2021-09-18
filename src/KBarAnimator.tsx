import * as React from "react";
import { useOuterClick } from "./utils";
import { VisualState } from "./types";
import useKBar from "./useKBar";

interface KBarAnimatorProps {
  style?: React.CSSProperties;
  className?: string;
}

const animationKeyframes = [
  {
    opacity: 0,
    transform: "scale(0.95)",
  },
  { opacity: 0.75, transform: "scale(1.02)" },
  { opacity: 1, transform: "scale(1)" },
];

export const KBarAnimator: React.FC<KBarAnimatorProps> = ({
  children,
  style,
  className,
}) => {
  const { visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }));

  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  const { options, query } = useKBar();

  const enterMs = options?.animations?.enterMs || 0;
  const exitMs = options?.animations?.exitMs || 0;

  // Show/hide animation
  React.useEffect(() => {
    if (visualState === VisualState.showing) {
      return;
    }

    const duration = visualState === VisualState.animatingIn ? enterMs : exitMs;

    const element = outerRef.current;

    element?.animate(animationKeyframes, {
      duration,
      easing:
        // TODO: expose easing in options
        visualState === VisualState.animatingOut ? "ease-in" : "ease-out",
      direction:
        visualState === VisualState.animatingOut ? "reverse" : "normal",
      fill: "forwards",
    });
  }, [options, visualState, enterMs, exitMs]);

  const previousHeight = React.useRef<number>();
  // Height animation
  React.useEffect(() => {
    // Only animate if we're actually showing
    if (visualState === VisualState.showing) {
      const outer = outerRef.current;
      const inner = innerRef.current;

      if (!outer || !inner) {
        return;
      }

      const ro = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const cr = entry.contentRect;

          if (!previousHeight.current) {
            previousHeight.current = cr.height;
          }

          outer.animate(
            [
              {
                height: `${previousHeight.current}px`,
              },
              {
                height: `${cr.height}px`,
              },
            ],
            {
              duration: enterMs / 2,
              // TODO: expose configs here
              easing: "ease-out",
              fill: "forwards",
            }
          );
          previousHeight.current = cr.height;
        }
      });

      ro.observe(inner);
      return () => {
        ro.unobserve(inner);
      };
    }
  }, [visualState, options, enterMs, exitMs]);

  useOuterClick(outerRef, () => {
    query.setVisualState(VisualState.animatingOut);
  });

  return (
    // TODO: improve here; no need for spreading
    <div
      ref={outerRef}
      style={{ ...animationKeyframes[0], ...style }}
      className={className}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
};
