import * as React from "react";
import { KBarContent } from "../../src/KBarContent";
import { KBarProvider } from "../../src/KBarContextProvider";
import KBarResults from "../../src/KBarResults";
import KBarSearch from "../../src/KBarSearch";

const searchStyles = {
  padding: "8px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
};

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
      <KBarProvider
        actions={{
          navBlogAction: {
            id: "navBlogAction",
            name: "Blog",
            shortcut: ["b"],
            keywords: "blog writing work",
            section: "Navigation",
            perform: () => window.alert("nav -> blog"),
          },
          contactAction: {
            id: "contactAction",
            name: "Contact",
            shortcut: ["c"],
            keywords: "email contact hello",
            section: "Navigation",
            perform: () => window.alert("nav -> contact"),
          },
          workAction: {
            id: "workAction",
            name: "Work",
            shortcut: ["w"],
            keywords: "work projects",
            section: "Navigation",
            perform: () => window.alert("nav -> work"),
          },
          twitterAction: {
            id: "twitterAction",
            name: "Twitter",
            shortcut: ["t"],
            keywords: "twitter social contact dm",
            section: "Navigation",
            perform: () =>
              window.open("https://twitter.com/timcchang", "_blank"),
          },
          searchBlogAction: {
            id: "searchBlogAction",
            name: "Search blog…",
            shortcut: [],
            keywords: "search find",
            section: "",
            children: ["blogPost1", "blogPost2"],
          },
          blogPost1: {
            id: "blogPost1",
            name: "Blog post 1",
            shortcut: [],
            keywords: "Blog post 1",
            section: "",
            perform: () => window.alert("nav -> blog post 1"),
            parent: "searchBlogAction",
          },
          blogPost2: {
            id: "blogPost2",
            name: "Blog post 2",
            shortcut: [],
            keywords: "Blog post 2",
            section: "",
            perform: () => window.alert("nav -> blog post 2"),
            parent: "searchBlogAction",
          },
        }}
        options={{
          animations: {
            enterMs: 200,
            exitMs: 200,
            maxContentHeight: 400,
          },
        }}
      >
        <KBarContent
          contentStyle={{
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <KBarSearch style={searchStyles} />
          <KBarResults
            onRender={(action, handlers, state) => (
              <Render action={action} handlers={handlers} state={state} />
            )}
          />
        </KBarContent>
      </KBarProvider>
    </>
  );
};

function Render({ action, handlers, state }) {
  const ownRef = React.useRef<HTMLDivElement>(null);

  const active = state.index === state.activeIndex;

  React.useEffect(() => {
    if (active) {
      ownRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [active]);

  return (
    <div
      ref={ownRef}
      {...handlers}
      style={{
        padding: "8px",
        background: state.index === state.activeIndex ? "#eee" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>{action.name}</span>
      {action.shortcut?.length ? (
        <kbd
          style={{
            padding: "4px 6px",
            background: "rgba(0 0 0 / .1)",
            borderRadius: "4px",
          }}
        >
          {action.shortcut}
        </kbd>
      ) : null}
    </div>
  );
}

export default App;
