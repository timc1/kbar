import { ReactElement, JSXElementConstructor, ReactNode } from "react";
import type { BaseAction, Action } from "../types";

interface ActionImplOptions {
  parent?: ActionImpl;
}

export class ActionImpl implements Action {
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

  constructor(action: BaseAction, options: ActionImplOptions = {}) {
    this.id = action.id;
    this.name = action.name;
    this.shortcut = action.shortcut;
    this.keywords = action.keywords;
    this.perform = action.perform;
    this.section = action.section;
    this.icon = action.icon;
    this.subtitle = action.subtitle;
    this.parent = options.parent;

    if (options.parent) {
      options.parent.addChild(this);
    }

    if (this.parent?.section && !this.section) {
      this.section = this.parent.section;
    }
  }

  addChild(action: ActionImpl) {
    if (!this.children.find((child) => child === action)) {
      // add parent's section as children section
      if (!action.section && this.section) {
        action.section = this.section;
      }
      this.children.push(action);
    }
  }

  removeChild(action: ActionImpl) {
    const index = this.children.findIndex((a) => a === action);
    if (index === -1) return;
    this.children = [
      ...this.children.slice(0, index),
      ...this.children.slice(index + 1),
    ];
  }

  static fromJSON(action: BaseAction, options: ActionImplOptions = {}) {
    return new ActionImpl(action, options);
  }
}
