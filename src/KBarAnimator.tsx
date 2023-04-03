import * as React from "react";
import { VisualState } from "./types";
import { useKBar } from "./useKBar";
import { useOuterClick } from "./utils";

interface KBarAnimatorProps {
  style?: React.CSSProperties;
  className?: string;
  disableCloseOnOuterClick?: boolean;
}

const appearanceAnimationKeyframes = [
  {
    opacity: 0,
    transform: "scale(.99)",
  },
  { opacity: 1, transform: "scale(1.01)" },
  { opacity: 1, transform: "scale(1)" },
];

const bumpAnimationKeyframes = [
  {
    transform: "scale(1)",
  },
  {
    transform: "scale(.98)",
  },
  {
    transform: "scale(1)",
  },
];

export const KBarAnimator: React.FC<
  React.PropsWithChildren<KBarAnimatorProps>
> = ({ children, style, className, disableCloseOnOuterClick }) => {
  const { visualState, currentRootActionId, query, options } = useKBar(
    (state) => ({
      visualState: state.visualState,
      currentRootActionId: state.currentRootActionId,
    })
  );

  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  const enterMs = options?.animations?.enterMs || 0;
  const exitMs = options?.animations?.exitMs || 0;

  // Show/hide animation
  React.useEffect(() => {
    if (visualState === VisualState.showing) {
      return;
    }

    const duration = visualState === VisualState.animatingIn ? enterMs : exitMs;

    const element = outerRef.current;

    element?.animate(appearanceAnimationKeyframes, {
      duration,
      easing:
        // TODO: expose easing in options
        visualState === VisualState.animatingOut ? "ease-in" : "ease-out",
      direction:
        visualState === VisualState.animatingOut ? "reverse" : "normal",
      fill: "forwards",
    });
  }, [options, visualState, enterMs, exitMs]);

  // Height animation
  const previousHeight = React.useRef<number>();
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

  // Bump animation between nested actions
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const element = outerRef.current;
    if (element) {
      element.animate(bumpAnimationKeyframes, {
        duration: enterMs,
        easing: "ease-out",
      });
    }
  }, [currentRootActionId, enterMs]);

  useOuterClick(outerRef, () => {
    if (disableCloseOnOuterClick) {
      return;
    }
    query.setVisualState(VisualState.animatingOut);
    options.callbacks?.onClose?.();
  });

  return (
    <div
      ref={outerRef}
      style={{
        ...appearanceAnimationKeyframes[0],
        ...style,
        pointerEvents: "auto",
      }}
      className={className}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
};
