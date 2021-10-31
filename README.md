# kbar

kbar is a simple plug-n-play React component to add a fast, portable, and extensible <kbd>command</kbd> + <kbd>k</kbd> interface to your site.

![demo](https://user-images.githubusercontent.com/12195101/134022553-af4a29e9-0a3d-40f1-9254-3bd9673f3401.gif)

## Background

<kbd>Command</kbd> + <kbd>k</kbd> interfaces are used to create a web experience where any type of action users would be able to do via clicking can be done through a command menu.

With macOS's Spotlight and Linear's <kbd>command</kbd> + <kbd>k</kbd> experience in mind, kbar aims to be a simple
abstraction to add a fast and extensible <kbd>command</kbd> + <kbd>k</kbd> menu to your site.

## Features

- Built in animations and fully customizable components
- Keyboard navigation support; e.g. <kbd>control</kbd> + <kbd>n</kbd> or <kbd>control</kbd> + <kbd>p</kbd> for the navigation wizards
- Keyboard shortcuts support for registering keystrokes to specific actions; e.g. hit <kbd>t</kbd> for Twitter
- Nested actions enable creation of rich navigation experiences; e.g. hit backspace to navigate to
  the previous action
- Performance as a first class priority; tens of thousands of actions? No problem.
- A simple data structure which enables anyone to easily build their own custom components

### Usage

Have a fully functioning command menu for your site in minutes. First, install kbar.

```
npm install kbar
```

There is a single provider which you will wrap your app around; you do not have to wrap your
_entire_ app; however, there are no performance implications by doing so.

```tsx
// app.tsx
import { KBarProvider } from "kbar";

function MyApp() {
  return <KBarProvider>// ...</KBarProvider>;
}
```

Let's add a few default actions. Actions are the core of kbar – an action define what to execute
when a user selects it.

```tsx
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
```

Next, we will pull in the provided UI components from kbar:

```tsx
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
```

At this point hitting <kbd>cmd</kbd>+<kbd>k</kbd> will animate in a search input and nothing more.

kbar provides a few utilities to render a performant list of search results.

- `useMatches` at its core returns a list of results based on the current search query, grouped by `action.section`
- `KBarResults` handles virtualizing your results

Combine the two utilities to create a powerful search interface:

```tsx
import {
  // ...
  KBarResults,
  useMatches,
  NO_GROUP,
} from "kbar";

// ...
// <KBarAnimator>
//   <KBarSearch />
<RenderResults />;
// ...

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
```

Hit <kbd>cmd</kbd>+<kbd>k</kbd> (or <kbd>ctrl</kbd>+<kbd>k</kbd>) and you should see a primitive command menu. kbar allows you to have full control over all
aspects of your command menu – refer to the <a href="https://kbar.vercel.app/docs">docs</a> to get
an understanding of further capabilities. Looking forward to see what you build.

## Contributing to kbar

Contributions are welcome!

### New features

Please [open a new issue](https://github.com/timc1/kbar/issues) so we can discuss prior to moving
forward.

### Bug fixes

Please [open a new Pull Request](https://github.com/timc1/kbar/pulls) for the given bug fix.

### Nits and spelling mistakes

Please [open a new issue](https://github.com/timc1/kbar/issues) for things like spelling mistakes
and README tweaks – we will group the issues together and tackle them as a group. Please do not
create a PR for it!
