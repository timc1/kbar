import * as React from "react";

export default function Home() {
  return (
    <>
      <p>
        kbar is a fully extensible command+k interface for your site. Try it out
        – press <kbd>cmd</kbd> and <kbd>k</kbd>.
      </p>

      <h3>Background</h3>

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

      <h4>Features</h4>

      <ul role="list">
        <li>Built in animations, fully customizable</li>
        <li>
          Keyboard navigation support; e.g. <kbd>ctrl</kbd> <kbd>n</kbd> /{" "}
          <kbd>ctrl</kbd> <kbd>p</kbd> for the navigation wizards
        </li>
        <li>
          Keyboard shortcuts support for registering keystrokes to specific
          actions; e.g. hit <kbd>t</kbd> for Twitter.
        </li>
        <li>Navigate between nested actions with backspace</li>
        <li>
          A simple data structure which enables anyone to easily build their
          custom components
        </li>
      </ul>

      <h4>Usage</h4>
    </>
  );
}
