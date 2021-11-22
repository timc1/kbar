import { Command } from "./Command";
import type { Action, ActionStore, IHistory } from "../types";

interface ActionImplOptions {
  store: ActionStore;
  ancestors?: ActionImpl[];
  history?: IHistory;
}

export class ActionImpl implements Action {
  id: Action["id"];
  name: Action["name"];
  shortcut: Action["shortcut"];
  keywords: Action["keywords"];
  section: Action["section"];
  icon: Action["icon"];
  subtitle: Action["subtitle"];
  /**
   * @deprecated action.perform deprecated in favor of action.command.perform
   */
  perform: Action["perform"];

  command: Command;

  ancestors: ActionImpl[] = [];
  children: ActionImpl[] = [];

  constructor(action: Action, options: ActionImplOptions) {
    Object.assign(this, action);
    this.id = action.id;
    this.name = action.name;
    this.command = new Command(
      {
        perform: action.perform,
      },
      {
        history: options.history,
      }
    );
    // Backward compatibility
    this.perform = this.command.perform;

    if (action.parent) {
      const parentActionImpl = options.store[action.parent];
      // TODO: add invariant; parentActionImpl must exist prior to creating child.
      if (parentActionImpl) {
        parentActionImpl.addChild(this);
      }
    }
  }
  parent?: string | undefined;

  addChild(childActionImpl: ActionImpl) {
    // add reference to ancestor here as well
    childActionImpl.ancestors.push(this);
    // we ensure that order of adding always goes
    // parent -> children, so no need to recurse
    this.children.push(childActionImpl);
  }

  removeChild(actionImpl: ActionImpl) {
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

  static create(action: Action, options: ActionImplOptions) {
    return new ActionImpl(action, options);
  }
}
