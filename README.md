.

## KBar

KBar is a simple plug-n-play component to add a fast,
portable, and extensible command interface to your site.

## Background

There are a few apps/sites out there with the concept of a command portal and triggering any
action through a few keyboard strokes; macOS, Abstract, Linear, etc. I have always been intrigued by the interactions and curious
about how to implement something of this sort. KBar is an attempt at building a command bar with as
much flexibility as possible.

### What we want to build

For v1, we are building KBar to represent and filter through a static data structure, particularly
useful for navigation to specific pages of a site or toggling specific actions; e.g. Creating a
_thing_, editing a _thing_, copying to a clipboard, etc.

- A data structure to represent the various types of actions that can be triggered
- A set of UI components to render the dialog, search, results, etc.

#### Data structure

```
Action
  - id
  - name
  - shortcut
  - keywords
  - perform
  - group
```

```
ActionContext
  - router
```

#### API

`actions` are defined once in the root of the site. An action has context of the current router and
knows whether it is applicable in the current context

In the root of the site:

```tsx
return (
  <>
    <KBar
      actions={{
        navBlogAction: {
          id: randomId(),
          name: "Blog",
          shortcut: ["b"],
          keywords: "blog writing work",
          group: "Navigation",
          perform: (ctx: ActionContext) => router.push("/blog"),
        },
        contactAction: {
          id: randomId(),
          name: "Contact",
          shortcut: ["c"],
          keywords: "email contact hello",
          group: "Navigation",
          perform: (ctx: ActionContext) => router.push("/contact"),
        },
      }}
    />
    // <App />
  </>
);
```
