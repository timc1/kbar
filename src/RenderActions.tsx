import * as React from "react";
import type { Action } from "./types";

export interface RenderActionsProps {
  actions: Action[];
}

export default function RenderActions(props: RenderActionsProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!props.actions.length) {
    return null;
  }

  return (
    <div>
      <p>RenderActions</p>
      <div>
        {props.actions.map((action, index) => (
          <div
            key={action.id}
            style={{
              background: currentIndex === index ? "#eee" : "#fff",
            }}
          >
            {action.name}
          </div>
        ))}
      </div>
    </div>
  );
}
