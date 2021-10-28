import "./index.scss";
import * as React from "react";
import { KBarAnimator } from "../../src/KBarAnimator";
import { KBarProvider } from "../../src/KBarContextProvider";
import KBarPortal from "../../src/KBarPortal";
import useMatches, { NO_GROUP } from "../../src/useMatches";
import KBarPositioner from "../../src/KBarPositioner";
import KBarSearch from "../../src/KBarSearch";
import KBarResults from "../../src/KBarResults";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Docs from "./Docs";
import SearchDocsActions from "./SearchDocsActions";
import { createAction } from "../../src/utils";
import { useAnalytics } from "./utils";
import { Action } from "../../src";
import Blog from "./Blog";

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
};

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
};

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
  background: "var(--background)",
};

const App = () => {
  useAnalytics();
  const history = useHistory();
  return (
    <KBarProvider
      actions={[
        {
          id: "homeAction",
          name: "Home",
          shortcut: ["h"],
          keywords: "back",
          section: "Navigation",
          perform: () => history.push("/"),
          icon: <HomeIcon />,
          subtitle: "Subtitles can help add more context.",
        },
        {
          id: "docsAction",
          name: "Docs",
          shortcut: ["g", "d"],
          keywords: "help",
          section: "Navigation",
          perform: () => history.push("/docs"),
        },
        {
          id: "contactAction",
          name: "Contact",
          shortcut: ["c"],
          keywords: "email hello",
          section: "Navigation",
          perform: () => window.open("mailto:timchang@hey.com", "_blank"),
        },
        {
          id: "twitterAction",
          name: "Twitter",
          shortcut: ["t"],
          keywords: "social contact dm",
          section: "Navigation",
          perform: () => window.open("https://twitter.com/timcchang", "_blank"),
        },
        createAction({
          name: "Github",
          shortcut: ["g", "h"],
          keywords: "sourcecode",
          section: "Navigation",
          perform: () => window.open("https://github.com/timc1/kbar", "_blank"),
        }),
        {
          id: "theme",
          name: "Change theme…",
          keywords: "interface color dark light",
          section: "Preferences",
        },
        {
          id: "darkTheme",
          name: "Dark",
          keywords: "dark",
          section: "",
          perform: () =>
            document.documentElement.setAttribute("data-theme-dark", ""),
          parent: "theme",
        },
        {
          id: "lightTheme",
          name: "Light",
          keywords: "light",
          section: "",
          perform: () =>
            document.documentElement.removeAttribute("data-theme-dark"),
          parent: "theme",
        },
      ]}
    >
      <SearchDocsActions />
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator style={animatorStyle}>
            <KBarSearch
              style={searchStyle}
              placeholder="Type a command or search…"
            />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      <Layout>
        <Switch>
          <Route path="/docs" exact>
            <Redirect to="/docs/overview" />
          </Route>
          <Route path="/docs/:slug">
            <Docs />
          </Route>
          <Route path="/blog">
            <Blog />
          </Route>
          <Route path="*">
            <Home />
          </Route>
        </Switch>
      </Layout>
    </KBarProvider>
  );
};

function RenderResults() {
  const groups = useMatches();
  const flattened = React.useMemo(
    () =>
      groups.reduce((acc, curr) => {
        acc.push(curr.name);
        acc.push(...curr.actions);
        return acc;
      }, []),
    [groups]
  );

  return (
    <KBarResults
      items={flattened.filter((i) => i !== NO_GROUP)}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem action={item} active={active} />
        )
      }
    />
  );
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
    }: {
      action: Action;
      active: boolean;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "12px 16px",
          background: active ? "var(--a1)" : "var(--background)",
          borderLeft: `2px solid ${
            active ? "var(--foreground)" : "transparent"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{action.name}</span>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}>
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

export default App;

function HomeIcon() {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m19.681 10.406-7.09-6.179a.924.924 0 0 0-1.214.002l-7.06 6.179c-.642.561-.244 1.618.608 1.618.51 0 .924.414.924.924v5.395c0 .51.414.923.923.923h3.236V14.54c0-.289.234-.522.522-.522h2.94c.288 0 .522.233.522.522v4.728h3.073c.51 0 .924-.413.924-.923V12.95c0-.51.413-.924.923-.924h.163c.853 0 1.25-1.059.606-1.62Z"
        fill="var(--foreground)"
      />
    </svg>
  );
}
