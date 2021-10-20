import * as React from "react";
import Code from "../Code";

export default function Actions() {
  return (
    <div>
      <h1>Actions</h1>
      <p>
        When a user searches for something in kbar, the result is a list of
        actions. These actions are represented by a simple object data
        structure.
      </p>
      <Code
        code={`interface Action {
    id: string;
    name: string;
    shortcut: string[];
    keywords: string;
    perform?: () => void;
    section?: string;
    parent?: ActionId | null | undefined;
    children?: ActionId[];
}`}
      />
      <p>kbar manages an internal state of action objects.</p>
      <p>
        Actions can have nested actions, represented by <code>children</code>{" "}
        above. With this, we can do things like building a folder-like
        experience where toggling one action leads to displaying a "nested" list
        of other actions.
      </p>
      <h3>Static, global actions</h3>
      <p>
        kbar takes an initial list of actions when instantiated. This initial
        list is considered a static/global list of actions. These actions exist
        on each page of your site.
      </p>
      <h3>Dynamic actions</h3>
      <p>
        While it is good to have a set of actions registered up front and
        available globally, sometimes you will want to have actions available
        only when on a specific page, or even when a specific component is
        rendered.
      </p>
      <p>
        Actions can be registered at runtime using the{" "}
        <code>useRegisterActions</code> hook. This dynamically adds and removes
        actions based on where the hook lives.
      </p>
    </div>
  );
}
