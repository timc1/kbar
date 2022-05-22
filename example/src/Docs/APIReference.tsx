import * as React from "react";
import { useLocation } from "react-router-dom";

export default function APIReference() {
  return (
    <div>
      <h1>API Reference</h1>
      <Heading name="useStore" />
      <p>
        Internal state management for all of kbar. It is built on top of a small
        publish/subscribe model in order to give us the ability to only re
        render components that hook into kbar state through the use of the
        public facing <code>useKBar</code> hook. Components which do not hook
        into the internal kbar state will never re render.
      </p>
      <Heading name="KBarProvider" />
      <p>
        Context provider for easy access to the internal state anywhere within
        the app tree.
      </p>
      <Heading name="KBarPortal" />
      <p>
        Renders the contents of kbar in a DOM element outside of the root app
        element.
      </p>
      <Heading name="KBarAnimator" />
      <p>
        Handles all animations; showing, hiding, height scaling using the Web
        Animations API.
      </p>
      <Heading name="KBarSearch" />
      <p>Renders an input which controls the internal search query state.</p>
      <Heading name="KBarResults" />
      <p>Renders a virtualized list of results.</p>
      <Heading name="useKBar" />
      <p>
        Accepts a collector function to retrieve specific values from state.
        Only re renders the component when return value deeply changes. All kbar
        components are built using this hook.
      </p>
      <Heading name="HistoryImpl" />
      <p>
        An internal history implementation which maintains a simple in memory
        list of actions that contain an undoable, negatable action.
      </p>
    </div>
  );
}

function Heading({ name }) {
  const location = useLocation();
  return (
    <h2
      id={name}
      style={{
        background: location.hash === `#${name}` ? "yellow" : undefined,
      }}
    >
      {name}
    </h2>
  );
}
