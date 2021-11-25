import * as React from "react";
import Code from "../Code";

export default function GettingStarted() {
  return (
    <div>
      <h1>Getting started</h1>
      <p>
        Get a simple command bar up and running quickly. In this example, we
        will use the APIs provided by kbar out of the box:
      </p>

      <Code code={`npm install kbar`} />

      <p>
        There is a single provider which you will wrap your app around; you do
        not have to wrap your <em>entire</em> app; however, there are no
        performance implications by doing so.
      </p>

      <Code
        code={`
// app.tsx
import { KBarProvider } from "kbar";

function MyApp() {
  return (
    <KBarProvider>
    // ...
    </KBarProvider>
  );
}
  `}
      />

      <p>
        Let's add a few default actions. Actions are the core of kbar – an
        action define what to execute when a user selects it.
      </p>

      <Code
        code={`const actions = [
  {
    id: "blog",
    name: "Blog",
    shortcut: ["b"],
    keywords: "writing words",
    perform: () => (window.location.pathname = "blog"),
  },
  {
    id: "contact",
    name: "Contact",
    shortcut: ["c"],
    keywords: "email",
    perform: () => (window.location.pathname = "contact"),
  },
]

return (
  <KBarProvider actions={actions}>
    // ...
  </KBarProvider>
);
`}
      />

      <p>Next, we will pull in the provided UI components from kbar:</p>

      <Code
        code={`// app.tsx
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
} from "kbar";

// ...
  return (
    <KBarProvider actions={actions}>
      <KBarPortal> // Renders the content outside the root node
        <KBarPositioner> // Centers the content
          <KBarAnimator> // Handles the show/hide and height animations
            <KBarSearch /> // Search input
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      <MyApp />
    </KBarProvider>;
  );
}
`}
      />

      <p>
        At this point hitting <kbd>cmd</kbd>+<kbd>k</kbd> will animate in a
        search input and nothing more.
      </p>

      <p>
        kbar provides a few utilities to render a performant list of search
        results.
      </p>

      <ul>
        <li>
          <code>useMatches</code> at its core returns a flattened list of
          results based on the current search query. This is a list of{" "}
          <code>string</code> and <code>Action</code> types.
        </li>
        <li>
          <code>KBarResults</code> takes the flattened list of results and
          renders them within a virtualized window.
        </li>
      </ul>

      <p>Combine the two utilities to create a powerful search interface:</p>

      <Code
        code={`import {
  // ...
  KBarResults,
  useMatches,
} from "kbar";

// ...
// <KBarAnimator>
//   <KBarSearch />
<RenderResults />
// ...

function RenderResults() {
  const { results } = useMatches();
    
    return (
      <KBarResults
      items={results}
      onRender={({ item, active }) =>
      typeof item === "string" ? (
        <div>{item}</div>
        ) : (
          <div
          style={{
            background: active ? "#eee" : "transparent",
          }}
          >
          {item.name}
          </div>
          )
        }
      />
    );
}`}
      />

      <p>
        Hit <kbd>cmd</kbd>+<kbd>k</kbd> (or <kbd>ctrl</kbd>+<kbd>k</kbd>) and
        you should see a primitive command menu. kbar allows you to have full
        control over all aspects of your command menu.
      </p>
    </div>
  );
}
