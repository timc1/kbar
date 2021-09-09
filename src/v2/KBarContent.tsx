import Portal from "@reach/portal";
import React from "react";
import { VisualState } from "./types";
import useKBar from "./useKBar";

interface KBarContentProps {
  children: React.ReactNode;
}

export const KBarContent = (props: KBarContentProps) => {
  const { visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }));

  if (visualState === VisualState.hidden) {
    return null;
  }

  return (
    <Portal>
      <Animator visualState={visualState}>{props.children}</Animator>
    </Portal>
  );
};

const animationKeyframes = [
  {
    opacity: 0,
    transform: "scale(0.95)",
  },
  { opacity: 0.75, transform: "scale(1.02)" },
  { opacity: 1, transform: "scale(1)" },
];

const backgroundSyle: React.CSSProperties = {
  position: "fixed",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  inset: "0px",
  padding: "calc(13vh - 0.48px) 16px 16px",
};

const contentStyle: React.CSSProperties = {
  maxWidth: "640px",
  width: "min-content",
  boxShadow: "0px 6px 20px rgb(0 0 0 / 20%)",
  ...animationKeyframes[0],
};

const Animator: React.FC<{
  visualState: Omit<VisualState, "hidden">;
  maxHeight?: number;
}> = (props) => {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const maxHeight = props.maxHeight || 400;
  const { options } = useKBar();

  // Show/hide animation
  React.useEffect(() => {
    if (props.visualState === VisualState.showing) {
      return;
    }

    const duration = VisualState.animatingIn
      ? options?.animations?.enterMs || 0
      : options?.animations?.exitMs || 0;

    const element = outerRef.current;

    element?.animate(animationKeyframes, {
      duration,
      easing:
        // TODO: expose easing in options
        props.visualState === VisualState.animatingOut ? "ease-in" : "ease-out",
      direction:
        props.visualState === VisualState.animatingOut ? "reverse" : "normal",
      fill: "forwards",
    });
  }, [options, props.visualState]);

  const previousHeight = React.useRef<number>();
  // Height animation
  React.useEffect(() => {
    // Only animate if we're actually showing
    if (props.visualState === VisualState.showing) {
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
                height: `${cr.height > maxHeight ? maxHeight : cr.height}px`,
              },
            ],
            {
              duration: options?.animations?.enterMs
                ? options.animations.enterMs / 2
                : 0,
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
  }, [props.visualState, options]);

  return (
    // TODO: expose styling for wrappers
    <div style={backgroundSyle}>
      <div ref={outerRef} style={contentStyle}>
        <div ref={innerRef}>{props.children}</div>
      </div>
    </div>
  );
};
