import * as React from "react";
import type { Action } from "./types";

export interface RenderActionsProps {
  actions: Action[];
  onRequestClose: () => void;
}

export default function RenderActions(props: RenderActionsProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const select = React.useCallback(() => {
    setCurrentIndex((index) => {
      const action = props.actions[index];
      action.perform({});
      props.onRequestClose();
      return index;
    });
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event) {
      event.stopPropagation();

      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        setCurrentIndex((index) => {
          if (index >= props.actions.length - 1) {
            return 0;
          } else {
            return index + 1;
          }
        });
      }

      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        setCurrentIndex((index) => {
          if (index === 0) {
            return props.actions.length - 1;
          } else {
            return index - 1;
          }
        });
      }

      if (event.key === "Enter") {
        select();
      }
    }

    setCurrentIndex(0);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.actions.length, props.onRequestClose, select]);

  if (!props.actions.length) {
    return null;
  }

  return (
    <>
      {props.actions.map((action, index) => (
        <div
          key={action.id}
          style={{
            background: currentIndex === index ? "#eee" : "#fff",
            cursor: "pointer",
          }}
          onMouseEnter={() => setCurrentIndex(index)}
          onClick={select}
        >
          {action.name}
        </div>
      ))}
    </>
  );
}
