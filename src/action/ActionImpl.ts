import { ReactElement, JSXElementConstructor, ReactNode } from "react";
import type { Action, IAction } from "../types";

interface ActionImplOptions {
  parent?: ActionImpl;
}

export class ActionImpl implements IAction {
  id: string;
  name: string;
  shortcut?: string[] | undefined;
  keywords?: string | undefined;
  perform?: (() => void) | undefined;
  section?: string | undefined;
  icon?: ReactElement<any, string | JSXElementConstructor<any>> | ReactNode;
  subtitle?: string | undefined;
  parent?: ActionImpl;
  children: ActionImpl[] = [];

  ancestors: ActionImpl[] = [];

  constructor(action: Action, options: ActionImplOptions = {}) {
    this.id = action.id;
    this.name = action.name;
    this.shortcut = action.shortcut;
    this.keywords = action.keywords;
    this.perform = action.perform;
    this.section = action.section;
    this.icon = action.icon;
    this.subtitle = action.subtitle;
    this.parent = options.parent;

    this.collectAncestors();

    if (options.parent) {
      options.parent.addChild(this);
    }
  }

  addChild(action: ActionImpl) {
    this.children.push(action);
    action.collectAncestors();
  }

  removeChild(action: ActionImpl) {
    const index = this.children.findIndex((a) => a === action);
    if (index === -1) return;
    this.children = [
      ...this.children.slice(0, index),
      ...this.children.slice(index + 1),
    ];
  }

  collectAncestors() {
    let parent = this.parent;
    let ancestors: ActionImpl[] = [];
    while (parent) {
      ancestors = [parent, ...ancestors];
      parent = parent.parent;
    }
    this.ancestors = ancestors;
  }

  static fromJSON(action: Action, options: ActionImplOptions = {}) {
    return new ActionImpl(action, options);
  }
}
