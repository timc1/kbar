import * as React from "react";

export default function Overview() {
  return (
    <div>
      <h1>Overview</h1>
      <p>
        Command+k interfaces are used to create a web experience where any type
        of action users would be able to do via clicking can be done through a
        command menu.
      </p>
      <p>
        With macOS's Spotlight and Linear's command+k experience in mind, kbar
        aims to be a simple abstraction to add a fast and extensible command+k
        menu to your site.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Built in animations alongside fully customizable components</li>
        <li>Keyboard navigation support</li>
        <li>Undo/redo support</li>
        <li>
          Keyboard shortcut support for registering keystroke patterns to
          triggering actions
        </li>
        <li>Performance as a priority; large search results, not a problem</li>
        <li>
          Simple data structure which enables anyone to easily build advanced
          custom components
        </li>
        <li>Screen reader support</li>
      </ul>
    </div>
  );
}
