import "./index.scss";
import * as React from "react";
import { KBarAnimator } from "../../src/KBarAnimator";
import { KBarProvider } from "../../src/KBarContextProvider";
import KBarGroupedResults, { NO_GROUP } from "../../src/KBarGroupedResults";
import KBarPortal from "../../src/KBarPortal";
import KBarPositioner from "../../src/KBarPositioner";
import KBarSearch from "../../src/KBarSearch";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Docs from "./Docs";
import SearchDocsActions from "./SearchDocsActions";
import {
  Action,
  ActionGroup,
  ActionGroupsWithTotal,
  VisualState,
} from "../../src/types";
import { createAction } from "../../src/utils";
import useKBar from "../../src/useKBar";

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

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
  background: "var(--background)",
};

const resultsStyle = {
  maxHeight: 400,
  overflow: "auto",
};

const flexGap = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const getResultItemStyle = (active: boolean) => ({
  padding: "8px 16px",
  background: active ? "var(--a1)" : "var(--background)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
};

const App = () => {
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
          shortcut: [],
          keywords: "interface color dark light",
          section: "Preferences",
          children: ["darkTheme", "lightTheme"],
        },
        {
          id: "darkTheme",
          name: "Dark",
          shortcut: [],
          keywords: "dark",
          section: "",
          perform: () =>
            document.documentElement.setAttribute("data-theme-dark", ""),
          parent: "theme",
        },
        {
          id: "lightTheme",
          name: "Light",
          shortcut: [],
          keywords: "light",
          section: "",
          perform: () =>
            document.documentElement.removeAttribute("data-theme-dark"),
          parent: "theme",
        },
      ]}
      options={{
        animations: {
          enterMs: 150,
          exitMs: 100,
        },
      }}
    >
      <SearchDocsActions />
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator style={animatorStyle}>
            <KBarSearch
              style={searchStyle}
              placeholder="Type a command or search…"
            />
            <KBarGroupedResults
              style={resultsStyle}
              onRender={(groupsWithCount: ActionGroupsWithTotal) => (
                <Render
                  groups={groupsWithCount.actionGroups}
                  total={groupsWithCount.total}
                />
              )}
            />
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
          <Route path="*">
            <Home />
          </Route>
        </Switch>
      </Layout>
    </KBarProvider>
  );
};

function Render({ groups, total }: { groups: ActionGroup[]; total: number }) {
  const { search, query, rootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    rootActionId: state.currentRootActionId,
  }));

  const [activeIndex, setActiveIndex] = React.useState(0);

  // Keyboard navigation
  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        event.preventDefault();
        setActiveIndex((curr) => (curr < total - 1 ? curr + 1 : 0));
      } else if (
        event.key === "ArrowUp" ||
        (event.ctrlKey && event.key === "p")
      ) {
        event.preventDefault();
        setActiveIndex((curr) => (curr > 0 ? curr - 1 : total - 1));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [groups, total]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll management
  React.useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  const perform = React.useCallback(() => {
    const list = groups.reduce((acc, curr) => {
      const actions = curr.actions;
      acc.push(...actions);
      return acc;
    }, [] as Action[]);

    const action = list[activeIndex];
    if (!action) return;

    if (action.perform) {
      action.perform();
      query.setVisualState(VisualState.animatingOut);
      return;
    }

    if (action.children) {
      query.setCurrentRootAction(action.id);
      return;
    }
  }, [activeIndex, groups, query]);

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        perform();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [perform]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [search, rootActionId]);

  let index = 0;

  return (
    <div>
      {groups.map((group) => (
        <div key={group.name}>
          {group.name !== NO_GROUP && (
            <div style={groupNameStyle}>{group.name}</div>
          )}
          {group.actions.map((action) => {
            const currIndex = index;
            const active = activeIndex === currIndex;
            index++;

            const handlers = {
              onPointerDown: () => setActiveIndex(currIndex),
              onMouseEnter: () => setActiveIndex(currIndex),
              onClick: perform,
            };

            return (
              <div
                ref={active ? scrollRef : null}
                key={action.id}
                style={getResultItemStyle(active)}
                {...handlers}
              >
                <div style={flexGap}>
                  {action.icon}
                  <div>
                    <div>{action.name}</div>
                    {action.subtitle ? (
                      <div style={{ fontSize: 14 }}>{action.subtitle}</div>
                    ) : null}
                  </div>
                </div>
                {action.shortcut.length ? (
                  <div style={flexGap}>
                    {action.shortcut.map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

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
