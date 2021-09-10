import * as React from "react";
import useKBar from "../../src/useKBar";

export default function Blog() {
  const { query } = useKBar();

  React.useEffect(() => {
    const unregister = query.registerActions([
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

    return () => {
      unregister();
    };
  }, []);

  return <div>Blog</div>;
}
