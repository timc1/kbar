import Portal from "@reach/portal";
import * as React from "react";
import { useOuterClick } from "./utils";
import { VisualState } from "./types";
import useKBar from "./useKBar";

interface KBarContentProps {
  children: React.ReactNode;
  backgroundStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
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
      <Animator visualState={visualState} {...props} />
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

const backgroundStyle: React.CSSProperties = {
  position: "fixed",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  inset: "0px",
  top:0, // needs to be explicit for safari to show the modal
  padding: "14vh 16px 16px",
  boxSizing: "border-box",
};

const contentStyle: React.CSSProperties = {
  width: "min-content",
  ...animationKeyframes[0],
};

const Animator: React.FC<
  {
    visualState: Omit<VisualState, "hidden">;
  } & KBarContentProps
> = (props) => {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  const { options, query } = useKBar();

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
                height: `${cr.height}px`,
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

  useOuterClick(outerRef, () => {
    query.setVisualState(VisualState.animatingOut);
  });

  return (
    // TODO: improve here; no need for spreading
    <div style={{ ...backgroundStyle, ...props.backgroundStyle }}>
      <div ref={outerRef} style={{ ...contentStyle, ...props.contentStyle }}>
        <div ref={innerRef}>{props.children}</div>
      </div>
    </div>
  );
};
