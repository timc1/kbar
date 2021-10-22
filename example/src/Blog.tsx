import * as React from "react";
import useRegisterActions from "../../src/useRegisterActions";
import { createAction } from "../../src/utils";

export default function Blog() {
  const [actions, setActions] = React.useState(
    Array.from(Array(4)).map((_, i) =>
      createAction({
        name: i.toString(),
        shortcut: [],
        keywords: "",
        perform: () => alert(i),
      })
    )
  );

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
