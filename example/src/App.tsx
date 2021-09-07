import * as React from "react";
import { KBar, toggle } from "../../src/index";

const App = () => {
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
      <KBar
        actions={{
          navBlogAction: {
            id: "navBlogAction",
            name: "Blog",
            shortcut: ["b"],
            keywords: "blog writing work",
            section: "Navigation",
            perform: () => console.log("nav -> blog"),
            parent: "root",
          },
          contactAction: {
            id: "contactAction",
            name: "Contact",
            shortcut: ["c"],
            keywords: "email contact hello",
            section: "Navigation",
            perform: () => console.log("nav -> contact"),
            parent: "root",
          },
          workAction: {
            id: "workAction",
            name: "Work",
            shortcut: ["w"],
            keywords: "work projects",
            section: "Navigation",
            perform: () => console.log("nav -> work"),
            parent: "root",
          },
          twitterAction: {
            id: "twitterAction",
            name: "Twitter",
            shortcut: ["t"],
            keywords: "twitter social contact dm",
            section: "Navigation",
            perform: () =>
              window.open("https://twitter.com/timcchang", "_blank"),
            parent: "root",
          },
          searchBlogAction: {
            id: "searchBlogAction",
            name: "Search blog…",
            shortcut: [],
            keywords: "search find",
            section: "",
            children: ["blogPost1", "blogPost2"],
            parent: "root",
          },
          blogPost1: {
            id: "blogPost1",
            name: "Blog post 1",
            shortcut: [],
            keywords: "Blog post 1",
            section: "",
            perform: () => console.log("nav -> blog post 1"),
            parent: "searchBlogAction",
          },
          blogPost2: {
            id: "blogPost2",
            name: "Blog post 2",
            shortcut: [],
            keywords: "Blog post 2",
            section: "",
            perform: () => console.log("nav -> blog post 2"),
            parent: "searchBlogAction",
          },
        }}
      />
      <button onClick={toggle}>Toggle</button>
    </>
  );
};

export default App;
