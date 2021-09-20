import * as React from "react";
import Code from "../Code";

export default function State() {
  return (
    <div>
      <h1>Interfacing with state</h1>
      <p>
        While it is great that kbar exposes some primitive components; e.g.{" "}
        <code>KBarSearch</code>, <code>KBarResults</code>, etc., what if you
        wanted to build some custom components, perhaps a set of breadcrumbs
        that display the current action and it's ancestor actions?
      </p>
      <h3>useKBar</h3>
      <p>
        <code>useKBar</code> enables you to hook into the current state of kbar
        and collect the values you need to build your custom UI.
      </p>
      <Code
        code={`import { useKBar } from "kbar";

function Breadcrumbs() {
    const { actionWithAncestors } = useKBar(state => {
        let actionAncestors = [];
        const collectAncestors = (actionId) => {
            const action = state.actions[actionId];
            if (!action.parent) {
                return null;
            }
            actionWithAncestors.unshift(action);
            const parent = state.actions[action.parent];
            collectAncestors(parent);
        };

        return {
            actionAncestors 
        }
    })
}

  return (
    <ul>
        {actionWithAncestors.map(action => (
            <li>
                // ...
            </li>
        ))}
    </ul>
  );`}
      />
      <p>
        Pass a callback to <code>useKBar</code> and retrieve only what you
        collect. This pattern was introduced to me by my friend{" "}
        <a href="https://twitter.com/prevwong" target="_blank" rel="noreferrer">
          Prev
        </a>
        . Reading any value from state enables you to create quite powerful
        UIs – in fact, all of kbar's internal components are built using the
        same pattern.
      </p>
    </div>
  );
}
