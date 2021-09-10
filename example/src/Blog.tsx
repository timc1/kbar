import * as React from "react";
import useRegisterActions from "../../src/useRegisterActions";

export default function Blog() {
  useRegisterActions([
    {
      id: "dynamicAction1",
      name: "Action only visible in Blog",
      shortcut: [],
      keywords: "",
      perform: () => window.alert("dynamic action"),
    },
    {
      id: "dynamicAction2",
      name: "Another action only visible in Blog",
      shortcut: [],
      keywords: "",
      perform: () => window.alert("dynamic action"),
    },
  ]);

  return <div>Blog</div>;
}
