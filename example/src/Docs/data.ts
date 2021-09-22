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
      accessingState: {
        name: "Interfacing with state",
        slug: "/docs/concepts/state",
        component: State,
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
