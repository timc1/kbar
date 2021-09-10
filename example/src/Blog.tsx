import * as React from "react";
import useKBar from "../../src/useKBar";

export default function Blog() {
  const { query } = useKBar();

  React.useEffect(() => {
    const unregister = query.registerActions([
      {
        id: "dynamicAction",
        name: "Dynamic action only visible in Blog",
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
