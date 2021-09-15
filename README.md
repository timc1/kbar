## kbar

kbar is a simple plug-n-play component to add a fast,
portable, and extensible command+k interface to your site.

![demo](https://user-images.githubusercontent.com/12195101/132958919-7a525cab-e191-4642-ae9a-5f22a3ba7845.gif)

## Background

Command+k interfaces are used to create a web experience where any type of action users would be able to do via clicking can be done through a command menu.

With macOS's Spotlight and Linear's command+k experience in mind, kbar aims to be a simple abstraction to add a fast and extensible command+k menu to your site.

### Features

- Built in animations, fully customizable
- Keyboard navigation support; e.g. ctrl n / ctrl p for the navigation wizards
- Keyboard shortcuts support for registering keystrokes to specific actions; e.g. hit t for Twitter
- Navigate between nested actions with backspace
- A simple data structure which enables anyone to easily build their custom components

Usage
Have a fully functioning command menu for your site in minutes. Let's start with a basic example. First, install kbar.

```
npm install kbar
```

At the root of your site, import and wrap the site with a KBarProvider.

```tsx
// app.tsx
import { KBarProvider } from "kbar";

return (
  <KBarProvider>
    <App />
  </KBarProvider>
);
```

kbar is built on top of `actions`. Actions define what to execute when a user selects it. Actions can have children which are just other actions.

Let's create a few static actions. Static actions are actions with no external dependencies; they don't rely on a method from some other hook, for instance. We'll talk about dynamic actions later.

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
];

return (
  <KBarProvider actions={actions}>
    <App />
  </KBarProvider>
);
```

kbar exposes a few components which handle animations, keyboard events, etc. You can compose them together like so:

```tsx
import { KBarProvider, KBarContent, KBarSearch, KBarResults } from "kbar";

<KBarProvider actions={actions}>
  <KBarContent>
    <KBarSearch />
    <KBarResults />
  </KBarContent>
  <MyApp />
</KBarProvider>;
```

Hit cmd+k and you should see a primitive command menu. kbar allows you to have full control over all
aspects of your command menu – refer to the <a href="https://kbar.vercel.app/docs">docs</a> to get an understanding of further capabilities.
