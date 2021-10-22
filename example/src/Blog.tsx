import * as React from "react";
import useRegisterActions from "../../src/useRegisterActions";
import { createAction } from "../../src/utils";

export default function Blog() {
  const actions = Array.from(Array(1000)).map((_, i) =>
    createAction({
      name: i.toString(),
      shortcut: [""],
      keywords: "",
      perform: () => alert(i),
    })
  );

  useRegisterActions(actions);

  return <div>Blog</div>;
}
