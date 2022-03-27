import invariant from "tiny-invariant";
import { Command } from "./Command";
import type { Action, ActionStore, History } from "../types";
import { Priority } from "../utils";

interface ActionImplOptions {
  store: ActionStore;
  ancestors?: ActionImpl[];
  history?: History;
}

/**
 * Extends the configured keywords to include the section
 * This allows section names to be searched for.
 */
const extendKeywords = ({ keywords = "", section = "" }: Action): string => {
  return `${keywords} ${
    typeof section === "string" ? section : section.name
  }`.trim();
};

export class ActionImpl implements Action {
  id: Action["id"];
  name: Action["name"];
  shortcut: Action["shortcut"];
  keywords: Action["keywords"];
  section: Action["section"];
  icon: Action["icon"];
  subtitle: Action["subtitle"];
  parent?: Action["parent"];
  /**
   * @deprecated use action.command.perform
   */
  perform: Action["perform"];
  priority: number = Priority.NORMAL;

  command?: Command;

  ancestors: ActionImpl[] = [];
  children: ActionImpl[] = [];

  constructor(action: Action, options: ActionImplOptions) {
    Object.assign(this, action);
    this.id = action.id;
    this.name = action.name;
    this.keywords = extendKeywords(action);
    const perform = action.perform;
    this.command =
      perform &&
      new Command(
        {
          perform: () => perform(this),
        },
        {
          history: options.history,
        }
      );
    // Backwards compatibility
    this.perform = this.command?.perform;

    if (action.parent) {
      const parentActionImpl = options.store[action.parent];
      invariant(
        parentActionImpl,
        `attempted to create an action whos parent: ${action.parent} does not exist in the store.`
      );
      parentActionImpl.addChild(this);
    }
  }

  addChild(childActionImpl: ActionImpl) {
    // add all ancestors for the child action
    childActionImpl.ancestors.unshift(this);
    let parent = this.parentActionImpl;
    while (parent) {
      childActionImpl.ancestors.unshift(parent);
      parent = parent.parentActionImpl;
    }
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
