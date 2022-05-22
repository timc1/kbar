import * as React from "react";
import { Link } from "react-router-dom";
import Code from "./Code";

export default function Home() {
  return (
    <>
      <p>
        <b>
          <a
            href="https://github.com/timc1/kbar"
            target="_blank"
            rel="noreferrer"
          >
            kbar
          </a>
        </b>{" "}
        is a fully extensible command+k interface for your site.
      </p>
      <p>
        Try it out – press <kbd>cmd</kbd>+<kbd>k</kbd> (macOS) or{" "}
        <kbd>ctrl</kbd>+<kbd>k</kbd> (Linux/Windows), or click the logo above.
      </p>
      <h3>Background</h3>
      <p>
        Command+k interfaces are used to create a web experience where any type
        of action users would be able to do via clicking can be done through a
        command menu.
      </p>
      <p>
        With macOS's Spotlight and Linear's command+k experience in mind, kbar
        aims to be a simple abstraction to add a fast and extensible command+k
        menu to your site.
      </p>
      <h4>Features</h4>
      <ul>
        <li>Built in animations, fully customizable</li>
        <li>
          Keyboard navigation support; e.g. <kbd>ctrl</kbd> <kbd>n</kbd> /{" "}
          <kbd>ctrl</kbd> <kbd>p</kbd> for the navigation wizards
        </li>
        <li>
          Keyboard shortcuts support for registering keystrokes to specific
          actions; e.g. hit <kbd>t</kbd> for Twitter
        </li>
        <li>Navigate between nested actions with backspace</li>
        <li>
          A simple data structure which enables anyone to easily build their
          custom components
        </li>
      </ul>
      <h4>Usage</h4>
      <p>
        Have a fully functioning command menu for your site in minutes. First,
        install kbar.
      </p>
      <Code code="npm install kbar" />
      <p>
        There is a single provider which you will wrap your app around; you do
        not have to wrap your entire app; however, there are no performance
        implications by doing so.
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
        code={`
     const actions = [
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
  } 
      `}
      />

      <p>Next, we will pull in the provided UI components from kbar:</p>

      <Code
        code={`
// app.tsx
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  NO_GROUP
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
        At this point hitting cmd+k (macOS) or ctrl+k (Linux/Windows) will
        animate in a search input and nothing more.
      </p>

      <p>
        kbar provides a few utilities to render a performant list of search
        results.
      </p>

      <ul>
        <li>
          <code>useMatches</code> at its core returns a flattened list of
          results and group name based on the current search query; i.e.{" "}
          <code>
            ["Section name", Action, Action, "Another section name", Action,
            Action]
          </code>
        </li>
        <li>
          KBarResults renders a performant virtualized list of these results
        </li>
      </ul>

      <p>Combine the two utilities to create a powerful search interface:</p>

      <Code
        code={`
import {
  // ...
  KBarResults,
  useMatches,
  NO_GROUP,
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
}

`}
      />

      <p>
        Hit <code>cmd+k</code> (macOS) or <code>ctrl+k</code> (Linux/Windows)
        and you should see a primitive command menu. kbar allows you to have
        full control over all aspects of your command menu – refer to the{" "}
        <Link to="/docs">docs</Link> to get an understanding of further
        capabilities. Looking forward to see what you build.
      </p>
    </>
  );
}
