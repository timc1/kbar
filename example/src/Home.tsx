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
        is a fully extensible command+k interface for your site. Try it out
        – press <kbd>cmd</kbd> and <kbd>k</kbd>, or click the logo above.
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
      <ul role="list">
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
        Have a fully functioning command menu for your site in minutes. Let's
        start with a basic example. First, install kbar.
      </p>
      <Code code="npm install kbar" />
      <p>
        At the root of your site, import and wrap the site with a{" "}
        <code>KBarProvider</code>.
      </p>
      <Code
        code={`// app.tsx

return (
  <KBarProvider>
    <App />
  </KBarProvider>
)`}
      />
      <p>
        kbar is built on top of <code>actions</code>. Actions define what to
        execute when a user selects it. Actions can have children which are just
        other actions.
      </p>
      <p>
        Let's create a few static actions. Static actions are actions with no
        external dependencies; they don't rely on a method from some other hook,
        for instance. We'll talk about dynamic actions later.
      </p>
      <Code
        code={`const actions = [
  {
    id: "blog",
    name: "Blog",
    shortcut: ["b"],
    keywords: "writing words",
    perform: () => window.location.pathname = "blog"
  },
  {
    id: "contact",
    name: "Contact",
    shortcut: ["c"],
    keywords: "email",
    perform: () => window.location.pathname = "contact"
  }
]

return (
  <KBarProvider actions={actions}>
    <App />
  </KBarProvider>
)`}
      />
      <p>
        kbar exposes a few components which handle animations, keyboard events,
        etc. You can compose them together like so:
      </p>
      <Code
        code={`<KBarProvider actions={actions}>
  <KBarContent>
    <KBarSearch />
    <KBarResults />
  </KBarContent>
  <MyApp />
</KBarProvider>`}
      />

      <p>
        Hit <code>cmd</code>+<code>k</code> and you should see a primitive
        command menu. kbar allows you to have full control over all aspects of
        your command menu – refer to the <Link to="/docs">docs</Link> to get an
        understanding of further capabilities.
      </p>
    </>
  );
}
