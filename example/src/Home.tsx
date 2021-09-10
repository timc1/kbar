import * as React from "react";

export default function Home() {
  return (
    <>
      <h1>kbar</h1>
      <ul>
        <li>cmd+k to toggle menu</li>
        <li>
          backspace when in a nested path to navigate back to previous path;
          e.g. search blog
        </li>
        <li>
          keyboard shortcuts registered; e.g. hit `t` when kbar is hidden to
          trigger the Twitter action
        </li>
      </ul>
    </>
  );
}
