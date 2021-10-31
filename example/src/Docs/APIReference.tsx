import * as React from "react";

export default function APIReference() {
  return (
    <div>
      <h1>API Reference</h1>
      <h2 id="useStore">useStore</h2>
      <p>
        Internal state management for all of kbar. It is built on top of a small
        publish/subscribe model in order to give us the ability to only re
        render components that hook into kbar state through the use of the
        public facing <code>useKBar</code> hook. Components which do not hook
        into the internal kbar state will never re render.
      </p>
      <h2 id="useKBar">useKBar</h2>
      <p>
        A hook to grab the latest values of the internal kbar state. All kbar
        components are built using this hook.
      </p>
      <h2 id="KBarProvider">KBarProvider</h2>
      <p>
        Context provider for easy access to the internal state anywhere within
        the app tree.
      </p>
      <h2 id="KBarPortal">KBarPortal</h2>
      <p>
        Renders the contents of kbar in a DOM element outside of the root app
        element.
      </p>
      <h2 id="KBarAnimator">KBarAnimator</h2>
      <p>
        Handles all animations; showing, hiding, height scaling using the Web
        Animations API.
      </p>
      <h2 id="KBarResults">KBarResults</h2>
      <p>Renders a virtualized list of results.</p>
      <h2 id="useKBar">useKBar</h2>
      <p>
        Accepts a collector function to retrieve specific values from state.
        Only re renders the component when return value deeply changes.
      </p>
    </div>
  );
}
