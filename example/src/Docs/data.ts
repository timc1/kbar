import Actions from "./Actions";
import APIReference from "./APIReference";
import GettingStarted from "./GettingStarted";
import Overview from "./Overview";
import Shortcuts from "./Shortcuts";
import State from "./State";

const data = {
  introduction: {
    name: "Introduction",
    slug: "/docs",
    children: {
      overview: {
        name: "Overview",
        slug: "/docs/overview",
        component: Overview,
      },
      gettingStarted: {
        name: "Getting started",
        slug: "/docs/getting-started",
        component: GettingStarted,
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
      },
      shortcuts: {
        name: "Shortcuts",
        slug: "/docs/concepts/shortcuts",
        component: Shortcuts,
      },
      accessingState: {
        name: "Interfacing with state",
        slug: "/docs/concepts/state",
        component: State,
      },
    },
  },
  apiReference: {
    name: "API Reference",
    slug: "/api",
    children: {
      kbarProvider: {
        name: "KBarProvider",
        slug: "/docs/api/#KBarProvider",
        component: APIReference,
      },
      kbarPortal: {
        name: "KBarPortal",
        slug: "/docs/api/#KBarPortal",
        component: APIReference,
      },
      kbarAnimator: {
        name: "KBarAnimator",
        slug: "/docs/api/#KBarAnimator",
        component: APIReference,
      },
      kbarSearch: {
        name: "KBarSearch",
        slug: "/docs/api/#KBarSearch",
        component: APIReference,
      },
      kbarResults: {
        name: "KBarResults",
        slug: "/docs/api/#KBarResults",
        component: APIReference,
      },
      useKBar: {
        name: "useKBar",
        slug: "/docs/api/#useKBar",
        component: APIReference,
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
      },
      custom: {
        name: "Custom styles",
        slug: "/docs/tutorials/custom-styles",
        component: null,
      },
    },
  },
};

export default data;
