import Actions from "./Actions";
import Overview from "./Overview";
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
        component: Overview,
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
        component: Actions,
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
        slug: "/docs/api#KBarProvider",
        component: Actions,
      },
      kbarPortal: {
        name: "KBarPortal",
        slug: "/docs/api#KBarPortal",
        component: Actions,
      },
      kbarAnimator: {
        name: "KBarAnimator",
        slug: "/docs/api#KBarAnimator",
        component: Actions,
      },
      kbarSearch: {
        name: "KBarSearch",
        slug: "/docs/api#KBarSearch",
        component: Actions,
      },
      kbarResults: {
        name: "KBarResults",
        slug: "/docs/api#KBarResults",
        component: Actions,
      },
      useKBar: {
        name: "useKBar",
        slug: "/docs/api#useKBar",
        component: Actions,
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
