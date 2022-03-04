import * as React from "react";
import Code from "../Code";

export default function Shortcuts() {
  return (
    <div>
      <h1>Shortcuts</h1>
      <p>
        kbar comes out of the box for registering keystroke patterns and
        triggering actions even when kbar is hidden.
      </p>
      <p>
        When registering an action, passing a valid property to{" "}
        <code>shortcut</code> will ensure that when users' keystroke pattern
        matches, that kbar will trigger that action.
      </p>
      <p>
        Imagine if you wanted to open a link to Twitter when the user types{" "}
        <kbd>g</kbd>+<kbd>t</kbd>, the action would look something like this:
      </p>
      <Code
        code={`const twitterAction = createAction({
  name: "Twitter",
  shortcut: ["g", "t"],
  perform: () => window.open("https://twitter.com/jack", "_blank")
})`}
      />
      <p>
        You can also use shortcuts to open kbar at a specific parent action. For
        example, if a user types <kbd>?</kbd>, you want to open kbar with the
        nested actions for "Search docs". Try it on this site – press{" "}
        <kbd>?</kbd> and you will see the results for searching through docs
        immediately shown.
      </p>
      <p>
        Actions without a <code>perform</code> property will already have this
        implicitly handled.
      </p>
      <h2>Changing the default command+k shortcut</h2>
      <p>
        Say you want to trigger kbar using a different shortcut, <kbd>cmd</kbd>+
        <kbd>shift</kbd>+<kbd>p</kbd>.
      </p>
      <p>
        You can override the default behavior by passing a valid string sequence
        to <code>KBarProvider.options.toggleShortcut</code> based on{" "}
        <a
          href="https://github.com/jamiebuilds/tinykeys"
          target="_blank"
          rel="noreferrer"
        >
          tinykeys
        </a>
        .
      </p>
    </div>
  );
}
