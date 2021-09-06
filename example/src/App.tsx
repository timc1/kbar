import * as React from "react";
import { KBar } from "../../src/index";

const App = () => {
  return (
    <>
      <h1>Wuzgood</h1>
      <KBar
        actions={{
          navBlogAction: {
            id: "1",
            name: "Blog",
            shortcut: ["b"],
            keywords: "blog writing work",
            group: "Navigation",
            perform: (ctx) => console.log("nav -> blog"),
          },
          contactAction: {
            id: "2",
            name: "Contact",
            shortcut: ["c"],
            keywords: "email contact hello",
            group: "Navigation",
            perform: (ctx) => console.log("nav -> contact"),
          },
        }}
      />
    </>
  );
};

export default App;
