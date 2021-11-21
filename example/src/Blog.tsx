import * as React from "react";
import { createAction, useRegisterActions } from "../../src";

const parent = createAction({
  name: "parent",
});

const child = createAction({
  parent: parent.id,
  name: "child",
});

const grandchild = createAction({
  parent: child.id,
  name: "grandchild",
});

const greatgrandchild = createAction({
  parent: grandchild.id,
  name: "greatgrandchild",
});

export default function Blog() {
  const [actions, setActions] = React.useState([
    ...Array.from(Array(100000)).map((_, i) =>
      createAction({
        name: i.toString(),
        shortcut: [],
        keywords: "",
        perform: () => alert(i),
      })
    ),
    parent,
    child,
    grandchild,
    greatgrandchild,
  ]);

  React.useEffect(() => {
    setTimeout(() => {
      setActions((actions) => [
        ...actions,
        createAction({
          name: "Surprise",
          shortcut: [],
          keywords: "",
          perform: () => alert("Surprise"),
        }),
        createAction({
          name: "Surprise 2",
          shortcut: [],
          keywords: "",
          perform: () => alert("Surprise 2"),
        }),
        createAction({
          name: "Surprise 3",
          shortcut: [],
          keywords: "",
          perform: () => alert("Surprise 3"),
        }),
      ]);
    }, 2000);
  }, []);

  useRegisterActions(actions, [actions]);

  return <div>Blog</div>;
}
