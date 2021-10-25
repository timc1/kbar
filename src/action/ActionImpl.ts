import { ReactElement, JSXElementConstructor, ReactNode } from "react";

type ActionId = string;

export interface Action {
  id: string;
  name: string;
  keywords?: string;
  shortcut?: string[];
  perform?: () => void;
  section?: string;
  parent?: ActionId | null | undefined;
  children?: ActionImpl[];
  icon?: string | React.ReactElement | React.ReactNode;
  subtitle?: string;
}

interface ActionImplOptions {
  parent?: string;
}

export class ActionImpl implements Action {
  id: string;
  name: string;
  keywords?: string | undefined;
  shortcut?: string[] | undefined;
  perform?: (() => void) | undefined;
  section?: string | undefined;
  parent?: string | null | undefined;
  children?: ActionImpl[] | undefined;
  icon?: ReactElement<any, string | JSXElementConstructor<any>> | ReactNode;
  subtitle?: string | undefined;

  options: ActionImplOptions;

  constructor(action: Action, options: ActionImplOptions = {}) {
    this.options = options;
    this.parent = this.options.parent;
    this.validate(action);

    this.id = action.id;
    this.name = action.name;
    this.keywords = action.keywords;
    this.shortcut = action.shortcut;
    this.perform = action.perform;
    this.section = action.section;
    this.icon = action.icon;
    this.subtitle = action.subtitle;
  }

  addChild(action: ActionImpl) {
    if (!this.children) this.children = [];
    if (this.children.indexOf(action) > -1) return action;
    this.children.push(action);
    action.parent = this.id;
    return action;
  }

  private validate(action: Action) {
    // TODO: validate
    return;
  }

  static fromJSON(obj: Action, options: ActionImplOptions = {}) {
    return new ActionImpl(obj, options);
  }
}
