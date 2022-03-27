import Actions from "./Actions";
import APIReference from "./APIReference";
import GettingStarted from "./GettingStarted";
import Overview from "./Overview";
import Priority from "./Priority";
import Shortcuts from "./Shortcuts";
import State from "./State";
import UndoRedo from "./UndoRedo";

const data = {
  introduction: {
    name: "Introduction",
    slug: "/docs",
    children: {
      overview: {
        name: "Overview",
        slug: "/docs/overview",
        component: Overview,
        section: "Overview",
      },
      gettingStarted: {
        name: "Getting started",
        slug: "/docs/getting-started",
        component: GettingStarted,
        section: "Overview",
      },
    },
  },
  concepts: {
    name: "Concepts",
    slug: "/concepts",
    children: {
      overview: {
        name: "Actions",
        slug: "/docs/concepts/actions",
        component: Actions,
        section: "Concepts",
      },
      shortcuts: {
        name: "Shortcuts",
        slug: "/docs/concepts/shortcuts",
        component: Shortcuts,
        section: "Concepts",
      },
      accessingState: {
        name: "State",
        slug: "/docs/concepts/state",
        component: State,
        section: "Concepts",
      },
      history: {
        name: "Undo/Redo",
        slug: "/docs/concepts/history",
        component: UndoRedo,
        section: "Concepts",
      },
      priority: {
        name: "Priority",
        slug: "/docs/concepts/priority",
        component: Priority,
        section: "Concepts",
      },
    },
  },
  apiReference: {
    name: "API Reference",
    slug: "/api",
    children: {
      useStore: {
        name: "useStore",
        slug: "/docs/api/#useStore",
        component: APIReference,
        section: "API Reference",
      },
      kbarProvider: {
        name: "KBarProvider",
        slug: "/docs/api/#KBarProvider",
        component: APIReference,
        section: "API Reference",
      },
      kbarPortal: {
        name: "KBarPortal",
        slug: "/docs/api/#KBarPortal",
        component: APIReference,
        section: "API Reference",
      },
      kbarAnimator: {
        name: "KBarAnimator",
        slug: "/docs/api/#KBarAnimator",
        component: APIReference,
        section: "API Reference",
      },
      kbarSearch: {
        name: "KBarSearch",
        slug: "/docs/api/#KBarSearch",
        component: APIReference,
        section: "API Reference",
      },
      kbarResults: {
        name: "KBarResults",
        slug: "/docs/api/#KBarResults",
        component: APIReference,
        section: "API Reference",
      },
      useKBar: {
        name: "useKBar",
        slug: "/docs/api/#useKBar",
        component: APIReference,
        section: "API Reference",
      },
      historyImpl: {
        name: "HistoryImpl",
        slug: "/docs/api/#HistoryImpl",
        component: APIReference,
        section: "API Reference",
      },
    },
  },
  tutorials: {
    name: "Tutorials",
    slug: "/tutorials",
    children: {
      basic: {
        name: "Basic tutorial",
        slug: "/docs/tutorials/basic",
        component: null,
        section: "Tutorials",
      },
      custom: {
        name: "Custom styles",
        slug: "/docs/tutorials/custom-styles",
        component: null,
        section: "Tutorials",
      },
    },
  },
};

export default data;
