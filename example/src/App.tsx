import "./index.scss";
import { Toaster } from "react-hot-toast";
import * as React from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Docs from "./Docs";
import useDocsActions from "./hooks/useDocsActions";
import { useAnalytics } from "./utils";
import Blog from "./Blog";

import {
  ActionId,
  KBarAnimator,
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarSearch,
  KBarResults,
  createAction,
  useMatches,
  ActionImpl,
  useKBar,
} from "../../src";
import useThemeActions from "./hooks/useThemeActions";

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
};

const App = () => {
  useAnalytics();
  const history = useHistory();
  const initialActions = [
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
      shortcut: ["g", "t"],
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
  ];

  return (
    <KBarProvider
      options={{
        enableHistory: true,
      }}
      actions={initialActions}
    >
      <CommandBar />
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
      <Toaster
        toastOptions={{
          position: "bottom-right",
        }}
      />
    </KBarProvider>
  );
};

function CommandBar() {
  useDocsActions();
  useThemeActions();
  return (
    <KBarPortal>
      <KBarPositioner>
        <KBarAnimator style={animatorStyle}>
          <KBarSearch style={searchStyle} />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
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
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          padding: "12px 16px",
          background: active ? "var(--a1)" : "transparent",
          borderLeft: `2px solid ${
            active ? "var(--foreground)" : "transparent"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
          >
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                  fontSize: 14,
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
