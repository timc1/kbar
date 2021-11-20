import type { Action2, ActionStore } from "../types";

interface ActionImplOptions {
  store: ActionStore;
  ancestors?: ActionImpl2[];
}

export class ActionImpl2 implements Action2 {
  id: Action2["id"];
  name: Action2["name"];
  shortcut: Action2["shortcut"];
  keywords: Action2["keywords"];
  section: Action2["section"];
  icon: Action2["icon"];
  subtitle: Action2["subtitle"];

  command;

  ancestors: ActionImpl2[] = [];
  children: ActionImpl2[] = [];

  constructor(action: Action2, options: ActionImplOptions) {
    Object.assign(this, action);
    this.id = action.id;
    this.name = action.name;

    if (action.parent) {
      const parentActionImpl = options.store[action.parent];
      // TODO: add invariant; parentActionImpl must exist prior to creating child.
      if (parentActionImpl) {
        parentActionImpl.addChild(this);
      }
    }
  }

  addChild(childActionImpl: ActionImpl2) {
    // add reference to ancestor here as well
    childActionImpl.ancestors.push(this);
    // we ensure that order of adding always goes
    // parent -> children, so no need to recurse
    this.children.push(childActionImpl);
  }

  removeChild(actionImpl: ActionImpl2) {
    // recursively remove all children
    const index = this.children.indexOf(actionImpl);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
    if (actionImpl.children) {
      actionImpl.children.forEach((child) => {
        this.removeChild(child);
      });
    }
  }

  // easily access parentActionImpl after creation
  get parentActionImpl() {
    return this.ancestors[this.ancestors.length - 1];
  }

  static create(action: Action2, options: ActionImplOptions) {
    return new ActionImpl2(action, options);
  }
}
